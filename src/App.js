import Logo from './assets/images/logo.png';
import './App.css';
import React from 'react';
import CropTool from './CropTool';

const App = () => {
	return (
		<div className="app">
			<header className="header">
				<img src={Logo} className="logo" alt="Omega company logo" />
				<div className="headerTextContainer">
					<h2>Image Fit and Crop Tool</h2>
					<p>
						Choose an image to upload, and use the 'Crop Image' and 'Fit Image'
						buttons to get your desired image{' '}
					</p>
				</div>
			</header>
			<div className="previewContainer">
				<CropTool />
			</div>
		</div>
	);
};

export default App;
