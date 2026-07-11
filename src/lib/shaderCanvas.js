// Minimal Shadertoy-style runner for a single-pass fragment shader on a WebGL2
// canvas. Provides iResolution, iTime and iMouse, draws one fullscreen triangle,
// and pauses itself when offscreen or when the tab is hidden.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// The user shader is Shadertoy-flavored: it defines mainImage() and reads the
// iResolution/iTime/iMouse uniforms plus gl_FragCoord. We wrap it in a GLSL ES
// 3.00 shell that declares those uniforms and calls mainImage from main().
function buildFragment(userSource) {
	return `#version 300 es
precision highp float;
precision highp int;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
out vec4 _fragColor;
${userSource}
void main() {
	vec4 color;
	mainImage(color, gl_FragCoord.xy);
	_fragColor = color;
}
`;
}

function compile(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compile failed:\n" + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function showPoster(canvas, poster) {
	if (!poster) return;
	const img = document.createElement("img");
	img.src = poster;
	img.alt = "";
	img.className = canvas.className;
	canvas.replaceWith(img);
}

export default function initShaderCanvas(canvas, userSource, opts = {}) {
	const { interactive = true, poster = null, timeOffset = 0, scale = 1 } = opts;

	const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
	if (!gl) {
		showPoster(canvas, poster);
		return;
	}

	const vs = compile(gl, gl.VERTEX_SHADER, VERT);
	const fs = compile(gl, gl.FRAGMENT_SHADER, buildFragment(userSource));
	if (!vs || !fs) {
		showPoster(canvas, poster);
		return;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program link failed:\n" + gl.getProgramInfoLog(program));
		showPoster(canvas, poster);
		return;
	}
	gl.useProgram(program);

	// Fullscreen triangle. Three verts cover the whole clip space.
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const aPos = gl.getAttribLocation(program, "aPos");
	gl.enableVertexAttribArray(aPos);
	gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

	const uResolution = gl.getUniformLocation(program, "iResolution");
	const uTime = gl.getUniformLocation(program, "iTime");
	const uMouse = gl.getUniformLocation(program, "iMouse");

	// iMouse mirrors Shadertoy: xy is the pointer in pixels (bottom-left origin),
	// z > 0 while the button is held. When released the shader auto-spins again.
	const mouse = { x: 0, y: 0, down: 0 };
	const dprCap = () => Math.min(window.devicePixelRatio || 1, 2) * scale;

	function resize() {
		const w = Math.max(1, Math.round(canvas.clientWidth * dprCap()));
		const h = Math.max(1, Math.round(canvas.clientHeight * dprCap()));
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
			gl.viewport(0, 0, w, h);
		}
	}

	if (interactive) {
		const setPos = (e) => {
			const r = canvas.getBoundingClientRect();
			const d = dprCap();
			mouse.x = (e.clientX - r.left) * d;
			mouse.y = (r.height - (e.clientY - r.top)) * d;
		};
		canvas.addEventListener("pointerdown", (e) => {
			mouse.down = 1;
			setPos(e);
			canvas.setPointerCapture(e.pointerId);
		});
		canvas.addEventListener("pointermove", (e) => {
			if (mouse.down) setPos(e);
		});
		const release = () => (mouse.down = 0);
		canvas.addEventListener("pointerup", release);
		canvas.addEventListener("pointercancel", release);
	}

	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	let visible = true;
	const io = new IntersectionObserver(
		(entries) => (visible = entries[0].isIntersecting),
		{ threshold: 0 }
	);
	io.observe(canvas);

	if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);

	// Accumulate elapsed time only across drawn frames so pausing (offscreen or
	// hidden tab) never shows up as a jump when the animation resumes.
	let elapsed = 0;
	let last = null;
	function frame(now) {
		requestAnimationFrame(frame);
		if (!visible || document.hidden) {
			last = null;
			return;
		}
		const advance = reduced && !mouse.down ? false : true;
		if (last !== null && advance) elapsed += (now - last) / 1000;
		last = now;

		resize();
		gl.uniform3f(uResolution, canvas.width, canvas.height, 1);
		gl.uniform1f(uTime, timeOffset + elapsed);
		gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.down, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	requestAnimationFrame(frame);
}
