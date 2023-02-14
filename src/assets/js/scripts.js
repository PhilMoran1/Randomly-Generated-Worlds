// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise.js';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
// import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"
// import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js"

// import * as TWEEN from '@tweenjs/tween.js'


//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import SimplexNoise from 'simplex-noise';
// import { createNoise3D } from 'simplex-noise';
// import { createNoise2D } from 'simplex-noise';


var createNoise2D = SimplexNoise.createNoise2D



// import * as dat from 'dat.gui';

// import side from "../images/boxsides.png";
// import leftarrow from "../images/arrow.png";
// import rightarrow from "../images/rightarrow.png";
// import New from "../images/new.png";

const side = new Image();
side.src = '../images/boxsides.png';

const leftarrow = new Image();
leftarrow.src = '../images/arrow.png';

const rightarrow = new Image();
rightarrow.src = '../images/rightarrow.png';

const New = new Image();
New.src = '../images/new.png';

console.log(side)

//const treeURL = new URL('../models/pinetree.gltf', import.meta.url);

// const treeURL = new URL('../models/lowpolytree.obj', import.meta.url);
// const treeMTL = new URL('../models/lowpolytree.mtl', import.meta.url);


// import { CubeTextureLoader, InstancedMesh, Mesh, Plane, TextureLoader } from 'three';
// import { WireframeGeometry } from 'three';

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.gammaOutput = true;

document.body.appendChild( renderer.domElement );

// Load the GLTFLoader module

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

// const directionallight = new THREE.DirectionalLight(0xFFFFFF,0.5);
// directionallight.position.set(-30,50,0)
// scene.add(directionallight)
// directionallight.castShadow = true;

// const dLightHelper = new THREE.DirectionalLightHelper(directionallight,5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionallight.shadow.camera);
// scene.add(dLightShadowHelper)

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight( 0xffffff, 1 );


light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 2000; // default
light.shadow.mapSize.height = 2000; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

light.position.set(-30,50,0)

light.shadow.camera.bottom = -50
light.shadow.camera.top = +50
light.shadow.camera.left = +100
light.shadow.camera.right = -100

light.shadow.bias = -0.005;
// const dLightHelper = new THREE.DirectionalLightHelper(light,5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(dLightShadowHelper)


// const spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-100,100,0);
// spotLight.castShadow = true;
// spotLight.angle = 0.1;

// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

// const light = new THREE.PointLight(0xffffff, 2)
// light.position.set(9, 5, 10)
// light.rotation.x = 0.5
// light.castShadow = true;

// scene.add(light)



// const light = new THREE.DirectionalLight(0xffffff, 1.7);
// light.position.set(5, 5, 5);
// light.castShadow = true;

// Set up shadow properties for the light
// light.shadow.mapSize.width = 50;
// light.shadow.mapSize.height = 50;
// light.shadow.camera.near = 0.5;
// light.shadow.camera.far = 50;

//scene.add(light);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);


camera.position.set(-10,30,30);
orbit.update()


const gui = new dat.GUI();

const options = {
    cameraX: -30,
    cameraY: 50,
    cameraZ: 0,
    cameraIntensity: 1
}

gui.add(options, 'cameraX',0,150);
gui.add(options, 'cameraY',0,150);
gui.add(options, 'cameraZ',0,150);
gui.add(options, 'cameraIntensity',0.001,150);



let currentObjects = [];


let step = 100;


let possibleTreeCoordinates = [];


//const plane = createPlane(step,1,1); // normal biome
function test() {
    MnL() 
}


function createPlane(step, multiplier,amp,heights,cols,pos=[0,0,0]){

        

        let m = new THREE.MeshPhongMaterial({side:THREE.BackSide, flatShading: true,vertexColors: true});
        let g = new THREE.PlaneGeometry(step, step, 800,225);
        
        
        
        const count = g.attributes.position.count;
        g.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3), 3 ) );
        
        setNoise(g, new THREE.Vector2(1, 1), multiplier, amp);

        const color = new THREE.Color();
        const colors = g.attributes.color;
        const vertices = g.attributes.position.array;

        // Sand: color.setHSL(0.17, 0.6, 0.86)
        // Grass: color.setHSL(0.37, 0.83, 0.39)
        // Rock: color.setHSL(0.0, 0.0, 0.3)
        // White snow: color.setHSL(0.0, 0.0, 1.0)
        
        for ( let i = 0, j = 0; i < vertices.length; i ++, j += 3 ) {


          if(g.attributes.position.getZ(i) < heights[4]){
              if(Math.random() < 0.1){
                color.setHSL(0, 0, (Math.random()/5)+0.80);
                colors.setXYZ( i, color.r, color.g, color.b );

              }else{
                color.setHSL(cols[4][0],cols[4][1],cols[4][2]);
                colors.setXYZ( i, color.r, color.g, color.b );

              }

          }else if(g.attributes.position.getZ(i) < heights[3]){
              if(Math.random() < 0.1){
                color.setHSL(0, 0, (Math.random()/5)+0.50);
                colors.setXYZ( i, color.r, color.g, color.b );

              }else{
                color.setHSL(cols[3][0],cols[3][1],cols[3][2]);
                colors.setXYZ( i, color.r, color.g, color.b );
              }


          }else if(g.attributes.position.getZ(i) < heights[2]){
            //   color.setHSL(0.285, 1, 0.60 );
            const a = g.attributes.position;
            possibleTreeCoordinates.push([a.getX(i),a.getY(i),a.getZ(i)])
            color.setHSL(cols[2][0],cols[2][1],cols[2][2])
              colors.setXYZ( i, color.r, color.g, color.b );



          }else if(g.attributes.position.getZ(i) < heights[1]){
              color.setHSL(cols[1][0],cols[1][1],cols[1][2]);
              colors.setXYZ( i, color.r, color.g, color.b );


          }else if(g.attributes.position.getZ(i) > heights[0]){
            color.setHSL(cols[0][0],cols[0][1],cols[0][2]);

              colors.setXYZ( i, color.r, color.g, color.b );
          }
        }

        
        let p = new THREE.Mesh(g,m)

        p.geometry.rotateX(Math.PI / 2)
        p.geometry.computeVertexNormals(true);
        p.geometry.toNonIndexed();

        p.castShadow = true;
        p.receiveShadow = true;
        p.name = "NEWPLANE"
        scene.add(p);
        p.position.set(pos[0],pos[1],pos[2])
        return p
}

function setNoise(g, uvShift, multiplier, amplitude){
    // const perlin = new ImprovedNoise();

    let NOISE = createNoise2D()

    // let newSeed = Date.now();
    // NOISE.seed(newSeed);
  let pos = g.attributes.position;
  let uv = g.attributes.uv;
  let vec2 = new THREE.Vector2();
  
  for(let i = 0; i < pos.count; i++){
    vec2.fromBufferAttribute(uv, i).add(uvShift).multiplyScalar(multiplier);
    let noise = 0;
    let q = 1;
    for(let i = 0; i < 4; i++){
        // noise += perlin.noise(vec2.x / q, vec2.y / q, 0) * (q / amplitude);
        noise += NOISE(vec2.x / q, vec2.y / q, 0) * (q / amplitude);
      q += 5;
    }
    pos.setZ(i, noise);
  }
}



function createWater(rawcolor,y,pos=[0,0,0]) {
    const color = new THREE.Color();
    color.setHSL(rawcolor[0],rawcolor[1],rawcolor[2]);

    const waterGeometry = new THREE.PlaneGeometry(100, 100, 1, 90)
    const waterMaterial = new THREE.MeshStandardMaterial({ color: color, metalness: 1 })
    var water = new THREE.Mesh(waterGeometry,waterMaterial);
    scene.add(water)

    water.receiveShadow = true;
    water.castShadow = true;

    water.rotation.x = -0.5 * Math.PI;

    water.position.set(pos[0],y,pos[2])
    return water
}





function createTrees(rawcolor,pos=[0,0,0]){

    const color = new THREE.Color();
    color.setHSL(rawcolor[0],rawcolor[1],rawcolor[2]);

    // add trees
    const treecount = 100000;
    // 0x013220


    //0x477D65
    const geometry = new THREE.ConeGeometry( 5, 20, 8 );
    const material = new THREE.MeshBasicMaterial( {color: color} );
    const cone = new THREE.InstancedMesh( geometry, material , treecount);


    cone.rotation.x = 0.5 * Math.PI;
    scene.add( cone );

    console.log(possibleTreeCoordinates.length)
    console.log(Math.random(0,possibleTreeCoordinates.length))
    console.log(Math.floor(Math.random() * (possibleTreeCoordinates.length - 0) ) + 0)
    const dummy = new THREE.Object3D();
    for (let i = 0; i < treecount; i++) {
        let coordinate = possibleTreeCoordinates[Math.floor(Math.random() * (possibleTreeCoordinates.length - 0) ) + 0]
        
        dummy.position.x = coordinate[0] + Math.random() - 0.5
        dummy.position.y = coordinate[1] + Math.random() - 0.5
        dummy.position.z = coordinate[2]
        dummy.rotation.x = -0.5 * Math.PI;
        dummy.scale.set(0.02, 0.02, 0.02);
        dummy.updateMatrix();
        cone.setMatrixAt(i,dummy.matrix)

    }
    cone.position.set(pos[0],pos[1],pos[2])
    return cone
}




// clouds
function createBubble(size,color) {
    // Create a group for the spheres
    const bubble = new THREE.Object3D();

    // Create five spheres
    const sphereGeometry = new THREE.SphereGeometry( 5, 8, 8 );
    const sphereMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.6
    });


    const spread = size / 30;

    const a = (spread * 2) / 10
    const b = a / 10

    for (let i = 0; i < size; i++) {
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    const scale = Math.random() * (a - b) + b;
    sphere.scale.set(scale,scale,scale)
        const max = spread
        const min = -spread
    sphere.position.set(
        Math.random() * (max - min) + min,
        Math.random()* ((max / 2) - min) + min,
        Math.random()* (max - min) + min
    )
    bubble.add( sphere );
    }
    return bubble

}

function createClouds(rawcolor,cloudcount,pos=[0,0,0]) {

const color = new THREE.Color();
color.setHSL(rawcolor[0],rawcolor[1],rawcolor[2]);

const clouds = new THREE.Group()

//const cloudcount = 20;
for (let i = 0; i < cloudcount; i++) {
    let bubble = createBubble((Math.random() * (90 - 10) + 10),color)
    
    bubble.receiveShadow = true;
    bubble.castShadow = true;

    const X = Math.random() * (40 - -40) + -40;
    const Z = Math.random() * (40 - -40) + -40;
    bubble.position.set(X,12,Z);
    clouds.add( bubble )
}
scene.add( clouds )

clouds.position.set(pos[0],pos[2],pos[2])
return clouds


}

function createIce() {

}




// Mountains and lakes biomes
function MnL(pos) {
    // const PLANE = createPlane(
    //     step,
    //     100,
    //     1,
    //     [0,4.5,2,-2,-9],
    //     [
    //         [0.125, 0.84, 0.67 ],
    //         [0.125, 0.84, 0.67 ], //sand
    //         [0.37, 0.83, 0.39], // green
    //         [0.0, 0, 0.4 ], // grey
    //         [0, 0, 1 ] // white
    //     ]
    //     );
    // const WATER = createWater();
    // const TREES = createTrees();
    // //TREES = createTrees();
    // const CLOUDS = createClouds();
    // currentObjects = [PLANE,WATER,TREES,CLOUDS]

    currentObjects = [
        createPlane(
                step,
                70,
                2,
                [0,4.5,2,-2,-9],
                [
                    [0.125, 0.84, 0.67 ],
                    [0.125, 0.84, 0.67 ], //sand
                    [0.37, 0.83, 0.39], // green
                    [0.0, 0, 0.4 ], // grey
                    [0, 0, 1 ] // white
                ],
                pos
                ),
        createWater(
            [202 / 360, 1, 0.37],
            //0x0077be,
            -3,
            pos
        ),
        createTrees(
            [138 / 360, 0.33, 0.34],
            pos
        ),
        createClouds(
            [0,0,1],
            //0xFFFFFF,
            20,
            pos
        )
    ]
}

// ice biome
function iceBiome(pos) {
    // const PLANE = createPlane(
    //     step,
    //     100,
    //     1,
    //     [0,4.5,2,-2,-9],
    //     [
    //         [0.0, 0, 0.4 ],
    //         [0.0, 0, 0.4 ],
    //         [0,0,1],
    //         [0.0, 0, 0.4 ], //grey
    //         [0, 0, 1 ] //white
    //     ]
    //     );
    // const WATER = createWater();
    // //const ICE = createIce();
    //currentObjects = [PLANE, WATER]
    currentObjects = [
        createPlane(
                step,
                70,
                2,
                [0,4.5,2,-2,-9],
                [
                    [0.0, 0, 0.4 ],
                    [0.0, 0, 0.4 ],
                    [0,0,1],
                    [0.0, 0, 0.4 ], //grey
                    [0, 0, 1 ] //white
                ],
                pos
                ),
                
        createWater(
            [202 / 360, 1, 0.37],
            -3,
            pos
        )
    ]
}

// random world
function randomWorld(pos) {
    // const PLANE = createPlane(
    //     step,
    //     100,
    //     10,
    //     [0,4.5,2,-2,-9],
    //     [
    //         [0.125, 0.84, 0.67 ],
    //         [0.125, 0.84, 0.67 ], //sand
    //         [0.37, 0.83, 0.39], // green
    //         [0.0, 0, 0.4 ], // grey
    //         [0, 0, 1 ] // white
    //     ]
    //     );
    // //const WATER = createWater();
    // //const TREES = createTrees();
    // const CLOUDS = createClouds();
    // currentObjects = [PLANE,CLOUDS]

    //let possibleAdditons = [createTrees,createClouds,createWater]
    const rndbig = () => { return Math.random() * (100 - -0) + -0 }
    const heights  = () => { return Math.random() * (20 - -20) + -20}
    const rnd  = () => { return Math.random() }

    currentObjects = [
        createPlane(
                step,
                Math.random() * (100 - 50) + 50,
                Math.random() * (2.5 - 0.5) + 0.5,

                // clean this up
                [heights(),heights(),heights(),heights(),heights()],
                [
                    [rnd(), rnd(), rnd() ],
                    [rnd(), rnd(), rnd() ], 
                    [rnd(), rnd(), rnd() ], 
                    [rnd(), rnd(), rnd() ], 
                    [rnd(), rnd(), rnd() ] 
                ],
                pos
                )

    ];

    

    if (Math.random() > 0.499) { currentObjects.push(createClouds(
            [rnd(),rnd(),rnd()],
            //0xFFFFFF,
            rndbig(),
            pos
        ))
    }


    if (Math.random() > 0.499) { 
        if (possibleTreeCoordinates.length > 0){
        currentObjects.push(
        createTrees(
            [rnd(),rnd(),rnd()],
            pos
            //20
    ))} }

    if (Math.random() > 0.499) { currentObjects.push(createWater(
        [rnd(),rnd(),rnd()],
        Math.random() * (10 - -20) + -20,
        pos
    
    ))
}
    


}

// MECHANICS

// left and right buttons
const textureLoader = new THREE.TextureLoader()
const createMaterials = (dir) => {return [
    new THREE.MeshBasicMaterial({map: textureLoader.load(side)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(side)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(side)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(side)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(dir)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(side)})
];}
test()
const wh = 0.4

const left = new THREE.Mesh(new THREE.BoxGeometry(wh,wh,wh),createMaterials(leftarrow));
const right = new THREE.Mesh(new THREE.BoxGeometry(wh,wh,wh),createMaterials(rightarrow));
const newbox = new THREE.Mesh(new THREE.BoxGeometry(wh,wh,wh),createMaterials(New));

scene.add( left )
scene.add( right )
scene.add( newbox )



let change = 0;

//create a raycaster
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

//const tween1 = TWEEN.Tween({x:0,y:0,z:0}).to({x:200,y:0,z:0}, 2000)

// listen for mouse clicks
document.addEventListener('click', onClick, false);

function onClick(event) {
  // update the mouse vector with the click position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // check if the ray intersects any of the boxes
  var intersects = raycaster.intersectObjects([left, right,newbox]);
    console.log(intersects)
  if (intersects.length > 0) {

    var selectedBox = intersects[0].object;
    console.log(selectedBox)

    let coords;
    let tween;
    let coords1 = {x: 1,y: 1,z: 1}
    let tween2 = new TWEEN.Tween(coords1) // Create a new tween that modifies 'coords'.
    .to({x: 1.2, y: 1.2, z: 1.2 }, 100).onUpdate(() => {
        selectedBox.scale.set(coords1.x,coords1.y,coords1.z)
    

    // }).to({x: 1, y: 1, z: 1 }, 1000).onUpdate(() => {
    //     for ( let i = 0; i < intersects.length; i ++) { 
    //         intersects[i].object.scale.set(coords.x,coords.y,coords.z)
    //     }
        
    }).onComplete(function() {
        let coords2 = {x: 1.2,y:1.2,z:1.2}
        let tween3 = new TWEEN.Tween(coords2) // Create a new tween that modifies 'coords'.
        .to({x: 1, y: 1, z: 1 }, 100).onUpdate(() => {
            selectedBox.scale.set(coords2.x,coords2.y,coords2.z)
        })
        .start()
    })
    .start()



    // change the position of other objects in the scene
    // based on the selected box
    if (selectedBox === left) {
        change--
        if (change < 0) { change = 2 }
    } else if (selectedBox === right) {
      change++
      if (change > 2) { change = 0 }
    }
    
    coords = {x: 0, y: 0} // Start at (0, 0)
    tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({x: 900, y: 0}, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
        for ( let i = 0; i < currentObjects.length; i ++) { 
            //console.log(currentObjects)
            currentObjects[i].position.set(coords.x,coords.y,0)
        }

        }).onComplete(function() {


            for ( let i = 0; i < currentObjects.length; i ++) { 
                try {
                currentObjects[i].geometrydispose()
                currentObjects[i].material.dispose()
                } catch {
                    //console.log("couldnt dispose of - ", currentObjects[i])
                }
                if (currentObjects[i].count > 1000) {console.log("removing trees..-")}
            
                scene.remove(currentObjects[i])
            }

            possibleTreeCoordinates = []
            currentObjects = [ ]
            if (change === 0) {MnL([-900,0,0])}
            else if (change === 1) { iceBiome([-900,0,0]) }
            else if (change === 2) { randomWorld([-900,0,0]) }
            coords = {x: -900, y: 0} // Start at (0, 0)
            tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({x: 0, y: 0}, 1000) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                .onUpdate(() => {
                for ( let i = 0; i < currentObjects.length; i ++) { 
                    //console.log(currentObjects)
                    currentObjects[i].position.set(coords.x,coords.y,0)
                }

                }).onComplete(function() {

                })
                .start() // Start the tween immediately.
            console.log(change)
            console.log(scene)
        })
        .start() // Start the tween immediately.
  }
}



console.log(scene)


function animate() {

    left.position.copy( camera.position );
    left.rotation.copy( camera.rotation );
    left.updateMatrix();
    left.translateZ( - 10 );
    left.translateX( - 6 )

    right.position.copy( camera.position );
    right.rotation.copy( camera.rotation );
    right.updateMatrix();
    right.translateZ( - 10 );
    right.translateX( + 6 )

    newbox.position.copy( camera.position );
    newbox.rotation.copy( camera.rotation );
    newbox.updateMatrix();
    newbox.translateZ( - 10 );
    newbox.translateY( - 3 )

    TWEEN.update()

    // spotLight.angle = options.angle;
    // spotLight.penumbra = options.penumbra;
    // spotLight.intensity = options.intensity;
    // directionallight.angle = options.angle;
    // directionallight.penumbra = options.penumbra;
    // directionallight.intensity = options.intensity;

    light.position.x = options.cameraX
    light.position.y = options.cameraY
    light.position.z = options.cameraZ
    light.intensity = options.cameraIntensity;
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})
