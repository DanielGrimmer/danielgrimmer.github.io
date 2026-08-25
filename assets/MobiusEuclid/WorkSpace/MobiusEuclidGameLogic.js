import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import geometryData from './geometryData.js';

class MobiusEuclidGame {
	constructor() {
		console.log("Initializing MobiusEuclidGame...");
		
		// Game state
		this.userType = localStorage.getItem('userType') || 'euclid';
		this.userPersp = localStorage.getItem('userPersp') || 'euclid';
		this.gameRoomId = localStorage.getItem('gameRoomId');
		
		// Movement state for Euclid
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = true;
		this.isJumping = false;
		
		// Physics parameters for Euclid
		this.playerHeight = 1.0;
		this.playerRadius = 0.25;
		this.jumpHeight = 1.2;
		this.playAreaRadius = 10;
		this.moveSpeed = 0.1;
		this.gravity = 0.01;
		this.velocity = 0;
		
		// Mobius state
		this.mobius = {
			r: 5.0,         // Initial radius
			theta: 0,        // Initial angle
			z: 0,            // Initial height
			width: 0.5,      // Line width
			height: 1.0,     // Line height
			velocity: 0,     // Vertical velocity
			isJumping: false,
			canJump: true,
			moveSpeed: {
				r: 0.1,      // Radius change speed
				theta: 0.05  // Angle change speed
			}
		};
		
		// Mouse variables
		this.isMouseDown = false;
		this.mouseX = 0;
		this.mouseY = 0;
		this.lastMouseX = 0;
		this.lastMouseY = 0;
		this.cameraRotationSpeed = 0.003;
		
		// Collision objects
		this.collisionObjects = [];
		
		// Debug mode
		this.debug = false;
		
		// Initialize the game
		this.init();
	}

	init() {
		console.log("Setting up the scene...");
		
		// Scene setup
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
		
		// Camera setup for Euclid
		this.euclid_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		
		// Renderer setup
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(this.renderer.domElement);
		
		// Create a player group for Euclid
		this.euclid_player = new THREE.Group();
		// Initialize Euclid at (0,-9), standing on the floor
    // DO NOT CHANGE THIS
		this.euclid_player.position.set(0, -9, this.playerHeight);
		this.scene.add(this.euclid_player);
		
		// Add camera to Euclid player (positioned at eye level)
		this.euclid_camera.position.set(0, 0, 0.8 * this.playerHeight); // Camera positioned near top of player
		this.euclid_player.add(this.euclid_camera);
		
		// Rotate the camera to look horizontally by setting x to 1.5 (not to 0)
    // DO NOT CHANGE THIS
		this.euclid_camera.rotation.x = 1.5;
		
		// Create Mobius line
		this.createMobiusLine();
		
		// Setup environment
		this.setupEnvironment();
		
		// Setup event listeners
		this.setupEventListeners();
		
		// Hide instructions on click
		document.addEventListener('click', () => {
			const instructions = document.getElementById('instructions');
			if (instructions) {
				instructions.classList.add('hidden');
			}
		});
		
		// Display player type and perspective
		this.updatePlayerDisplay();
		
		// Add player type and perspective toggle buttons
		this.addToggleButtons();
		
		// Start game loop
		this.animate();
	}

	createMobiusLine() {
		// Calculate line endpoints based on r and theta
		const intersections = this.calculateLineBoundaryIntersections(this.mobius.r, this.mobius.theta);
				
				if (!intersections) {
			console.warn("Couldn't create Mobius line - invalid parameters");
					return;
				}
				
				// Calculate the length and center of the line segment
				const dx = intersections.point2.x - intersections.point1.x;
				const dy = intersections.point2.y - intersections.point1.y;
				const length = Math.sqrt(dx*dx + dy*dy);
				const centerX = (intersections.point1.x + intersections.point2.x) / 2;
				const centerY = (intersections.point1.y + intersections.point2.y) / 2;
				
				// Create a line representation using a box
				const geometry = new THREE.BoxGeometry(
					length,
			this.mobius.width,
			this.mobius.height
				);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color for Mobius
		this.mobius_mesh = new THREE.Mesh(geometry, material);
				
				// Position the line
		this.mobius_mesh.position.set(
					centerX,
					centerY,
			this.mobius.z + this.mobius.height / 2 // Middle of the height
				);
				
				// Rotate to align with the line
		this.mobius_mesh.rotation.z = Math.atan2(dy, dx);
		
		this.scene.add(this.mobius_mesh);
		console.log("Mobius line created and added to scene");
	}

	updateMobiusLine() {
		// Calculate new line endpoints based on updated r and theta
		const intersections = this.calculateLineBoundaryIntersections(this.mobius.r, this.mobius.theta);
		
		if (!intersections) {
			console.warn("Couldn't update Mobius line - invalid parameters");
			return;
		}
		
		// Calculate the length and center of the line segment
		const dx = intersections.point2.x - intersections.point1.x;
		const dy = intersections.point2.y - intersections.point1.y;
		const length = Math.sqrt(dx*dx + dy*dy);
		const centerX = (intersections.point1.x + intersections.point2.x) / 2;
		const centerY = (intersections.point1.y + intersections.point2.y) / 2;
		
		// Update geometry for new length
		this.mobius_mesh.geometry.dispose();
		this.mobius_mesh.geometry = new THREE.BoxGeometry(
			length,
			this.mobius.width,
			this.mobius.height
		);
		
		// Update position
		this.mobius_mesh.position.set(
			centerX,
			centerY,
			this.mobius.z + this.mobius.height / 2 // Middle of the height
		);
		
		// Update rotation
		this.mobius_mesh.rotation.z = Math.atan2(dy, dx);
	}

	updatePlayerDisplay() {
		// Update player type display
		const playerTypeElement = document.getElementById('playerType');
		if (playerTypeElement) {
			playerTypeElement.textContent = this.userType;
		}
		
		// Update player perspective display
		const playerPerspElement = document.getElementById('playerPersp');
		if (playerPerspElement) {
			playerPerspElement.textContent = this.userPersp;
		}
	}

	addToggleButtons() {
		// Create container for buttons
		const buttonContainer = document.createElement('div');
		buttonContainer.style.position = 'absolute';
		buttonContainer.style.bottom = '20px';
		buttonContainer.style.left = '20px';
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '10px';
		document.body.appendChild(buttonContainer);
		
		// Create button to toggle player type
		const typeButton = document.createElement('button');
		typeButton.textContent = 'Change Player Type';
		typeButton.style.padding = '10px';
		typeButton.style.cursor = 'pointer';
		typeButton.addEventListener('click', () => this.changePlayerType());
		buttonContainer.appendChild(typeButton);
		
		// Create button to toggle player perspective
		const perspButton = document.createElement('button');
		perspButton.textContent = 'Change Perspective';
		perspButton.style.padding = '10px';
		perspButton.style.cursor = 'pointer';
		perspButton.addEventListener('click', () => this.changePlayerPerspective());
		buttonContainer.appendChild(perspButton);
	}

	changePlayerType() {
		// Toggle player type between euclid and mobius
		this.userType = this.userType === "euclid" ? "mobius" : "euclid";
		localStorage.setItem("userType", this.userType);
		console.log(`Player type changed to: ${this.userType}`);
		this.updatePlayerDisplay();
	}

	changePlayerPerspective() {
		// Toggle player perspective between euclid and mobius
		this.userPersp = this.userPersp === "euclid" ? "mobius" : "euclid";
		localStorage.setItem("userPersp", this.userPersp);
		console.log(`Player perspective changed to: ${this.userPersp}`);
		this.updatePlayerDisplay();
	}

	setupEnvironment() {
		// Create a floor
		const floorGeometry = new THREE.CircleGeometry(this.playAreaRadius, 32);
		
		// Load floor texture
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load('floorEuc1.png', (texture) => {
			// Don't repeat the texture, scale it to fit
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			
			const floorMaterial = new THREE.MeshStandardMaterial({ 
				map: texture, 
				side: THREE.DoubleSide 
			});
			
			const floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.position.z = 0; // Place at z=0 (ground level)
			this.scene.add(floor);
			console.log("Floor added with texture");
		}, undefined, (error) => {
			console.error('Error loading texture:', error);
			// Fallback to a simple material if texture loading fails
			const floorMaterial = new THREE.MeshStandardMaterial({ 
				color: 0x555555, 
				side: THREE.DoubleSide 
			});
			const floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.position.z = 0; // Place at z=0 (ground level)
			this.scene.add(floor);
			console.log("Floor added with fallback material");
		});
		
		// Add ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.scene.add(ambientLight);
		
		// Add directional light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 10);
		this.scene.add(directionalLight);
		
		// Load geometry from geometryData.js
		this.loadGeometryData();
		
		// Add coordinate axes for debugging
		if (this.debug) {
			const axesHelper = new THREE.AxesHelper(5);
			this.scene.add(axesHelper);
		}
	}
	
	// Calculate line intersection with circle boundary
	calculateLineBoundaryIntersections(r, theta) {
		// Line equation: x*cos(theta) + y*sin(theta) = r
		// Circle equation: x^2 + y^2 = R^2
		// We need to find where they intersect
		
		const R = this.playAreaRadius; // Circle radius
		
		// For a line with equation a*x + b*y = c
		const a = Math.cos(theta);
		const b = Math.sin(theta);
		const c = r;
		
		// Distance from origin to line
		const d = Math.abs(c) / Math.sqrt(a*a + b*b);
		
		if (d > R) {
			// Line doesn't intersect circle
			return null;
		}
		
		// Length from perpendicular point to intersection
		const L = Math.sqrt(R*R - d*d);
		
		// Perpendicular point from origin to line
		const x0 = a * c / (a*a + b*b);
		const y0 = b * c / (a*a + b*b);
		
		// Unit vector along the line
		const dx = -b; // Perpendicular to normal vector
		const dy = a;
		
		// Calculate intersection points
		const x1 = x0 + L * dx;
		const y1 = y0 + L * dy;
		const x2 = x0 - L * dx;
		const y2 = y0 - L * dy;
		
		return {
			point1: { x: x1, y: y1 },
			point2: { x: x2, y: y2 }
		};
	}
	
	loadGeometryData() {
		console.log("Loading geometry from geometryData.js");
		
		// Add cylinders from geometry data
		if (geometryData.cylinders && geometryData.cylinders.length > 0) {
			geometryData.cylinders.forEach(cylinder => {
				const geometry = new THREE.CylinderGeometry(
					cylinder.radius, cylinder.radius, cylinder.height, 32
				);
				const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
				const mesh = new THREE.Mesh(geometry, material);
				
				// Position the cylinder
				// Note: In the data, x,y are horizontal and z is vertical (bottom of cylinder)
				mesh.position.set(
					cylinder.position.x,
					cylinder.position.y,
					cylinder.position.z + cylinder.height / 2 // Center vertically
				);
				
				// Rotate the cylinder to stand upright (Three.js cylinders have Y as height axis)
				mesh.rotation.x = Math.PI / 2;
				
				this.scene.add(mesh);
				
				// Add to collision objects (using correct coordinates)
				this.collisionObjects.push({
					type: 'cylinder',
					position: new THREE.Vector3(
						cylinder.position.x,
						cylinder.position.y,
						cylinder.position.z
					),
					radius: cylinder.radius,
					height: cylinder.height,
					mesh: mesh
				});
				
				console.log(`Added cylinder at (${cylinder.position.x}, ${cylinder.position.y}, ${cylinder.position.z}) with radius ${cylinder.radius} and height ${cylinder.height}`);
			});
		} else {
			console.warn("No cylinders found in geometryData");
		}
		
		// Add lines/walls from geometry data
		if (geometryData.lines && geometryData.lines.length > 0) {
			geometryData.lines.forEach((line, index) => {
				// Get line parameters
				const r = line.polarPosition.r;
				const theta = line.polarPosition.theta;
				
				// Calculate intersections with the play area boundary
				const intersections = this.calculateLineBoundaryIntersections(r, theta);
				
				if (!intersections) {
					console.warn(`Line ${index} doesn't intersect the play area`);
					return;
				}
				
				// Calculate the length and center of the line segment
				const dx = intersections.point2.x - intersections.point1.x;
				const dy = intersections.point2.y - intersections.point1.y;
				const length = Math.sqrt(dx*dx + dy*dy);
				const centerX = (intersections.point1.x + intersections.point2.x) / 2;
				const centerY = (intersections.point1.y + intersections.point2.y) / 2;
				
				// Create a line representation using a box
				const geometry = new THREE.BoxGeometry(
					length,
					line.thickness,
					line.height
				);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
				const mesh = new THREE.Mesh(geometry, material);
				
				// Position the line
				mesh.position.set(
					centerX,
					centerY,
					line.polarPosition.z + line.height / 2 // Middle of the height
				);
				
				// Rotate to align with the line
				mesh.rotation.z = Math.atan2(dy, dx);
				
				this.scene.add(mesh);
				
				// Add to collision objects
				this.collisionObjects.push({
					type: 'line',
					polarPosition: line.polarPosition, // Store original polar position
					r: r,
					theta: theta,
					z: line.polarPosition.z,
					thickness: line.thickness,
					height: line.height,
					length: length,
					intersection1: intersections.point1,
					intersection2: intersections.point2,
					mesh: mesh
				});
				
				console.log(`Added line from (${intersections.point1.x.toFixed(2)}, ${intersections.point1.y.toFixed(2)}) to (${intersections.point2.x.toFixed(2)}, ${intersections.point2.y.toFixed(2)}) with height ${line.height}`);
			});
		} else {
			console.warn("No lines found in geometryData");
		}
	}

	setupEventListeners() {
		// Keyboard controls
		document.addEventListener('keydown', (event) => {
			switch (event.code) {
				case 'KeyW': this.moveForward = true; break;
				case 'KeyS': this.moveBackward = true; break;
				case 'KeyA': this.moveLeft = true; break;
				case 'KeyD': this.moveRight = true; break;
				case 'Space': 
					if (this.userType === 'euclid') {
						if (!this.isJumping && this.canJump) {
							this.isJumping = true;
							this.velocity = 0.15;
						}
					} else if (this.userType === 'mobius') {
						if (!this.mobius.isJumping && this.mobius.canJump) {
							this.mobius.isJumping = true;
							this.mobius.velocity = 0.15;
						}
					}
					break;
			}
		});

		document.addEventListener('keyup', (event) => {
			switch (event.code) {
				case 'KeyW': this.moveForward = false; break;
				case 'KeyS': this.moveBackward = false; break;
				case 'KeyA': this.moveLeft = false; break;
				case 'KeyD': this.moveRight = false; break;
			}
		});
		
		// Mouse handling for looking around
		document.addEventListener('mousedown', () => {
			this.isMouseDown = true;
		});
		
		document.addEventListener('mouseup', () => {
			this.isMouseDown = false;
		});
		
		document.addEventListener('mousemove', (event) => {
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
			
			if (this.isMouseDown && this.userPersp === 'euclid') {
				this.handleMouseMovement_Euclid(event);
			}
			
			this.lastMouseX = this.mouseX;
			this.lastMouseY = this.mouseY;
		});

		// Window resizing
		window.addEventListener('resize', () => {
			this.euclid_camera.aspect = window.innerWidth / window.innerHeight;
			this.euclid_camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	handleMouseMovement_Euclid(event) {
		// Only perform rotations when mouse is down for better control
		const deltaX = this.mouseX - this.lastMouseX;
		const deltaY = this.mouseY - this.lastMouseY;
		
		// Rotate the player (and camera) with reduced rotation speed
		this.euclid_player.rotation.z -= deltaX * this.cameraRotationSpeed;
		
		// Limit vertical rotation but allow full horizontal view
		const verticalRotation = this.euclid_camera.rotation.x - deltaY * this.cameraRotationSpeed;
		this.euclid_camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, verticalRotation));
	}

	// Check if the player is standing on a cylinder
	isOnCylinder(cylinder) {
		// Distance from player to cylinder center (horizontal)
		const dx = this.euclid_player.position.x - cylinder.position.x;
		const dy = this.euclid_player.position.y - cylinder.position.y;
		const horizontalDistance = Math.sqrt(dx * dx + dy * dy);
		
		// Vertical position check
		const playerFeetZ = this.euclid_player.position.z - this.playerHeight;
		const cylinderTopZ = cylinder.position.z + cylinder.height;
		
		// Check if player is above cylinder and within its radius
		return (horizontalDistance < cylinder.radius + this.playerRadius) && 
			   (Math.abs(playerFeetZ - cylinderTopZ) < 0.1);
	}
	
	// Check if the player is colliding with a cylinder from the side
	isCollidingWithCylinder(cylinder, proposedPosition) {
		// Distance from proposed position to cylinder center (horizontal)
		const dx = proposedPosition.x - cylinder.position.x;
		const dy = proposedPosition.y - cylinder.position.y;
		const horizontalDistance = Math.sqrt(dx * dx + dy * dy);
		
		// Vertical overlap check
		const playerBottomZ = proposedPosition.z - this.playerHeight;
		const playerTopZ = proposedPosition.z;
		const cylinderTopZ = cylinder.position.z + cylinder.height;
		
		// Check if there's vertical overlap (player and cylinder occupy same vertical space)
		const verticalOverlap = (playerBottomZ < cylinderTopZ) && (playerTopZ > cylinder.position.z);
		
		// Return true if there's horizontal and vertical collision
		return verticalOverlap && (horizontalDistance < cylinder.radius + this.playerRadius);
	}
	
	// Calculate distance from point to line segment
	distanceToLineSegment(point, lineStart, lineEnd) {
		const lineVector = new THREE.Vector3().subVectors(lineEnd, lineStart);
		const pointVector = new THREE.Vector3().subVectors(point, lineStart);
		
		// Project pointVector onto lineVector
		const lineLength = lineVector.length();
		const lineDirection = lineVector.clone().normalize();
		const projection = pointVector.dot(lineDirection);
		
		// Get the closest point on the line segment
		let closestPoint;
		if (projection <= 0) {
			closestPoint = lineStart.clone();
		} else if (projection >= lineLength) {
			closestPoint = lineEnd.clone();
		} else {
			closestPoint = lineStart.clone().add(lineDirection.multiplyScalar(projection));
		}
		
		// Calculate distance from point to closest point
		return point.distanceTo(closestPoint);
	}
	
	// Check if the player is standing on a line
	isOnLine(line) {
		// Calculate closest point on the line to the player
		// For a line r, theta, the distance formula is:
		// d = |x*cos(theta) + y*sin(theta) - r|
		const playerX = this.euclid_player.position.x;
		const playerY = this.euclid_player.position.y;
		
		// Distance from player to line (horizontal)
		const distance = Math.abs(
			playerX * Math.cos(line.theta) + 
			playerY * Math.sin(line.theta) - 
			line.r
		);
		
		// Vertical position check
		const playerFeetZ = this.euclid_player.position.z - this.playerHeight;
		const lineTopZ = line.z + line.height;
		
		// Check if player is above line and close enough horizontally
		return (distance < line.thickness / 2 + this.playerRadius) && 
			   (Math.abs(playerFeetZ - lineTopZ) < 0.1);
	}
	
	// Check if the player is colliding with a line from the side
	isCollidingWithLine(line, proposedPosition) {
		// For collision with the side of a line, we need to check:
		// 1. If player is at the same height as the line
		// 2. If player is horizontally close enough to the line
		
		// Vertical overlap check
		const playerBottomZ = proposedPosition.z - this.playerHeight;
		const playerTopZ = proposedPosition.z;
		const lineTopZ = line.z + line.height;
		
		// Check if there's vertical overlap
		const verticalOverlap = (playerBottomZ < lineTopZ) && (playerTopZ > line.z);
		
		if (!verticalOverlap) {
			return false;
		}
		
		// Calculate distance from player to line (horizontally)
		const lineStart = new THREE.Vector3(line.intersection1.x, line.intersection1.y, 0);
		const lineEnd = new THREE.Vector3(line.intersection2.x, line.intersection2.y, 0);
		const playerPosition = new THREE.Vector3(proposedPosition.x, proposedPosition.y, 0);
		
		const distance = this.distanceToLineSegment(playerPosition, lineStart, lineEnd);
		
		// Check if player is close enough to the line
		return distance < line.thickness / 2 + this.playerRadius;
	}

	checkCollisions_Euclid() {
		// Initially assume player is falling
		let isOnGround = false;
		let highestZ = 0;
		
		// Check collision with floor
		if (this.euclid_player.position.z <= this.playerHeight) {
			isOnGround = true;
			highestZ = 0;
		}
		
		// Check collisions with objects
		for (const obj of this.collisionObjects) {
			if (obj.type === 'cylinder') {
				if (this.isOnCylinder(obj)) {
					isOnGround = true;
					highestZ = Math.max(highestZ, obj.position.z + obj.height);
				}
			} else if (obj.type === 'line') {
				if (this.isOnLine(obj)) {
					isOnGround = true;
					highestZ = Math.max(highestZ, obj.z + obj.height);
				}
			}
		}
		
		return { isOnGround, highestZ };
	}

	checkSideCollisions_Euclid(proposedPosition) {
		// Check side collisions with all objects
		for (const obj of this.collisionObjects) {
			if (obj.type === 'cylinder') {
				if (this.isCollidingWithCylinder(obj, proposedPosition)) {
					return true;
				}
			} else if (obj.type === 'line') {
				if (this.isCollidingWithLine(obj, proposedPosition)) {
					return true;
				}
			}
		}
		
		return false;
	}

	updatePlayer_Euclid() {
		// Get forward direction based on player rotation
		const direction = new THREE.Vector3(0, 1, 0); // Y is forward in our coordinate system
		direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.euclid_player.rotation.z);
		
		// Get right direction
		const right = new THREE.Vector3(1, 0, 0); // X is right
		right.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.euclid_player.rotation.z);
		
		// Store old position for collision reversion
		const oldPosition = this.euclid_player.position.clone();
		
		// Calculate proposed new position
		const proposedPosition = oldPosition.clone();
		
		if (this.moveForward) {
			proposedPosition.addScaledVector(direction, this.moveSpeed);
		}
		if (this.moveBackward) {
			proposedPosition.addScaledVector(direction, -this.moveSpeed);
		}
		if (this.moveLeft) {
			proposedPosition.addScaledVector(right, -this.moveSpeed);
		}
		if (this.moveRight) {
			proposedPosition.addScaledVector(right, this.moveSpeed);
		}
		
		// Check for side collisions with proposed position
		const hasSideCollision = this.checkSideCollisions_Euclid(proposedPosition);
		
		// Only update position if there's no side collision
		if (!hasSideCollision) {
			this.euclid_player.position.copy(proposedPosition);
		}
		
		// Check collisions and update player state
		const { isOnGround, highestZ } = this.checkCollisions_Euclid();
		
		// Apply jumping/gravity
		if (this.isJumping) {
			this.euclid_player.position.z += this.velocity;
			this.velocity -= this.gravity;
			
			// Check if landed on something
			if (isOnGround && this.velocity <= 0) {
				this.euclid_player.position.z = highestZ + this.playerHeight;
				this.isJumping = false;
				this.canJump = true;
			}
		} else {
			// Not jumping, but check if we're on ground
			if (isOnGround) {
				this.euclid_player.position.z = highestZ + this.playerHeight;
				this.canJump = true;
			} else {
				// Start falling
				this.isJumping = true;
				this.velocity = 0;
			}
		}
		
		// Enforce play area boundary
		const distanceFromOrigin = Math.sqrt(
			this.euclid_player.position.x * this.euclid_player.position.x + 
			this.euclid_player.position.y * this.euclid_player.position.y
		);
		
		if (distanceFromOrigin > this.playAreaRadius - this.playerRadius) {
			const angle = Math.atan2(this.euclid_player.position.y, this.euclid_player.position.x);
			this.euclid_player.position.x = (this.playAreaRadius - this.playerRadius) * Math.cos(angle);
			this.euclid_player.position.y = (this.playAreaRadius - this.playerRadius) * Math.sin(angle);
		}
		
		// Ensure z is never negative
		if (this.euclid_player.position.z < this.playerHeight) {
			this.euclid_player.position.z = this.playerHeight;
			this.isJumping = false;
			this.velocity = 0;
			this.canJump = true;
		}
	}

	updatePlayer_Mobius() {
		// Handle Mobius controls
		// W/S controls radius (distance from center)
		if (this.moveForward) {
			this.mobius.r += this.mobius.moveSpeed.r;
			if (this.mobius.r > this.playAreaRadius) {
				this.mobius.r = this.playAreaRadius;
			}
		}
		if (this.moveBackward) {
			this.mobius.r -= this.mobius.moveSpeed.r;
      if (this.mobius.r < -this.playAreaRadius) {
				this.mobius.r = - this.playAreaRadius;
			}
		}
		
		// A/D controls angle
		if (this.moveLeft) {
			this.mobius.theta += this.mobius.moveSpeed.theta;
			if (this.mobius.theta > Math.PI * 3) {
				this.mobius.theta -= Math.PI * 6;
			}
		}
		if (this.moveRight) {
			this.mobius.theta -= this.mobius.moveSpeed.theta;
			if (this.mobius.theta < - Math.PI * 3) {
				this.mobius.theta += Math.PI * 6;
			}
		}
		
		// Handle jumping
		if (this.mobius.isJumping) {
			this.mobius.z += this.mobius.velocity;
			this.mobius.velocity -= this.gravity;
			
			// Check if landed
			if (this.mobius.z <= 0 && this.mobius.velocity < 0) {
				this.mobius.z = 0;
				this.mobius.isJumping = false;
				this.mobius.canJump = true;
			}
		}
		
		// Ensure z is never negative
		if (this.mobius.z < 0) {
			this.mobius.z = 0;
			this.mobius.isJumping = false;
			this.mobius.velocity = 0;
			this.mobius.canJump = true;
		}
		
		// Update the Mobius line position
		this.updateMobiusLine();
		
		// Log Mobius state for debugging
		console.log(`Mobius: r=${this.mobius.r.toFixed(2)}, theta=${this.mobius.theta.toFixed(2)}, z=${this.mobius.z.toFixed(2)}`);
	}

	render_Euclid() {
		// Render the scene using Euclid's camera
		this.renderer.render(this.scene, this.euclid_camera);
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		
		// Update player based on user type
		if (this.userType === 'euclid') {
			this.updatePlayer_Euclid();
		} else {
			this.updatePlayer_Mobius();
		}
		
		// Render based on user perspective
		if (this.userPersp === 'euclid') {
			this.render_Euclid();
		} else {
			// Will implement render_Mobius in the future
			// For now, fallback to Euclid rendering
			this.render_Euclid();
			console.log("Mobius perspective not yet implemented, using Euclid perspective");
		}
	}
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM loaded, starting game");
	const game = new MobiusEuclidGame();
});