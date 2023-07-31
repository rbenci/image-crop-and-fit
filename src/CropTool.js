import React, { useState, createRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import download from 'downloadjs';

export const CropTool = () => {
	const [image, setImage] = useState(null);
	const [cropData, setCropData] = useState(null);
	const [filename, setFilename] = useState(null);
	const cropperRef = createRef();

	const handleDownload = () => {
		const filenameWithoutExtension =
			filename.substr(0, filename.lastIndexOf('.')) || filename;
		const fileExtension = filename.substr(filename.lastIndexOf('.'));
		download(
			cropData,
			`${filenameWithoutExtension}-edited${fileExtension}`,
			'image/png'
		);
	};
	const onChange = (e) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
			setCropData(null);
			setFilename(files[0].name);
		};
		reader.readAsDataURL(files[0]);
	};

	const getCropData = () => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
		}
	};

	const fitAll = () => {
		// Get the image element
		const image = document.querySelector('.cropper-container img');

		if (typeof image !== 'undefined') {
			const canvas = document.createElement('canvas');
			const targetWidth = 1920;
			const targetHeight = 556;
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const ctx = canvas.getContext('2d');

			// Draw white background
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Get the resized image data and draw onto canvas
			const aspectRatio = image.naturalWidth / image.naturalHeight;
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
			ctx.drawImage(
				image,
				0,
				0,
				image.naturalWidth,
				image.naturalHeight,
				offsetX,
				offsetY,
				canvasWidth,
				canvasHeight
			);

			// Set the crop data to the resized image as a base64 string
			setCropData(canvas.toDataURL());
		}
	};

	return (
		<div className="cropToolContainer">
			<div className="cropContainer">
				<input type="file" onChange={onChange} />

				{image && (
					<p>
						<strong>Instructions: </strong>
						Adjust the position of the highlighted rectangle below by dragging
						it, and zooming in and out using your mouse. The highlighted
						rectangle represents the part of the image that will be included
						after cropping it, so it can be moved around to fit your desired
						purpose. The dimensions of the rectangle will always stay the same,
						as they are predefined based on the website UI that they will be a
						part of. If you do not want to crop your image, you can choose to
						fit it instead. Check the preview section at the bottom to see what
						your final image looks like.
					</p>
				)}
				<Cropper
					ref={cropperRef}
					style={{ height: 'auto', width: '80vw' }}
					zoomTo={0.5}
					initialAspectRatio={1}
					autoCropArea={1}
					aspectRatio={1920 / 556}
					highlight={true}
					dragMode={'move'}
					cropBoxMovable={true}
					cropBoxResizable={true}
					toggleDragModeOnDblclick={false}
					preview=".img-preview"
					src={image}
					viewMode={2}
					minCropBoxHeight={10}
					minCropBoxWidth={10}
					background={false}
					responsive={true}
					checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
					guides={true}
					center={true}
				/>
			</div>
			<div className="buttonsContainer">
				<div className="button" onClick={getCropData}>
					Crop
				</div>
				<div className="button" onClick={fitAll}>
					Fit All
				</div>
			</div>

			<div className="previewContainer">
				<div className="previewHeader">
					<h1>Preview</h1>
					<div className="button" onClick={handleDownload}>
						Download
					</div>
				</div>

				<div
					style={{
						width: '100%',
						padding: 0,
						boxSizing: 'border-box',
						border: 'solid',
					}}
				>
					<img
						style={{ width: '80vw', margin: 0, padding: 0 }}
						src={cropData}
						alt="edited image preview"
					/>
				</div>
			</div>
		</div>
	);
};

export default CropTool;
