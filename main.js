const input = document.getElementById('file-input');
const preview = document.getElementById('preview');
const cropBtn = document.getElementById('crop-btn');
const fitAllBtn = document.getElementById('fit-all-btn');
let cropper;

input.addEventListener('change', (e) => {
	const file = e.target.files[0];

	if (file) {
		const reader = new FileReader();

		reader.onload = (e) => {
			const imgData = e.target.result;
			preview.src = imgData;

			cropper = new Cropper(preview, {
				viewMode: 2,
				autoCropArea: 1,
				aspectRatio: 1920 / 556,
				guides: true,
				center: true,
				highlight: true,
				dragMode: 'move',
				cropBoxMovable: true,
				cropBoxResizable: true,
				toggleDragModeOnDblclick: false,
				minContainerWidth: 300,
				minContainerHeight: 300,
			});

			cropBtn.disabled = false;
			fitAllBtn.disabled = false;
		};

		reader.readAsDataURL(file);
	}
});

function downloadCanvas(canvas, fileName) {
	canvas.toBlob((blob) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	}, 'image/png');
}

cropBtn.addEventListener('click', () => {
	const canvas = cropper.getCroppedCanvas({
		width: 1920,
		height: 556,
		fillColor: '#fff',
		imageSmoothingEnabled: false,
		imageSmoothingQuality: 'high',
	});
	downloadCanvas(canvas, 'cropped-image.png');
});

fitAllBtn.addEventListener('click', () => {
	const imageData = cropper.getImageData();
	const aspectRatio = imageData.naturalWidth / imageData.naturalHeight;
	const targetWidth = 1920;
	const targetHeight = 556;

	let canvasWidth, canvasHeight;
	if (aspectRatio > targetWidth / targetHeight) {
		canvasWidth = targetWidth;
		canvasHeight = Math.round(targetWidth / aspectRatio);
	} else {
		canvasHeight = targetHeight;
		canvasWidth = Math.round(targetHeight * aspectRatio);
	}

	const offsetX = (targetWidth - canvasWidth) / 2;
	const offsetY = (targetHeight - canvasHeight) / 2;

	const canvas = document.createElement('canvas');
	canvas.width = targetWidth;
	canvas.height = targetHeight;
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, targetWidth, targetHeight);
	ctx.drawImage(
		preview,
		0,
		0,
		imageData.naturalWidth,
		imageData.naturalHeight,
		offsetX,
		offsetY,
		canvasWidth,
		canvasHeight
	);

	downloadCanvas(canvas, 'fit-all-image.png');
});
