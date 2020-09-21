//when it's over, lots of text dumping to do
import * as THREE from '../js/three.js-r117/build/three.module.js';
import {GLTFLoader} from '../js/three.js-r117/examples/jsm/loaders/GLTFLoader.js';

//initializing mines position matrices
var minesp1 = [];
for(var i=0; i<6; i++) {
  minesp1[i] = [];
  for(var j=0; j<8; j++) {
      minesp1[i][j] = 0;
  }
}

var minesp2 = [];
for(var i=0; i<6; i++) {
  minesp2[i] = [];
  for(var j=0; j<8; j++) {
      minesp2[i][j] = 0;
  }
}

var nminesp1=0;
var nminesp2=0;

//initializing clicked patches matrices
var clickedp1 = [];
for(var i=0; i<6; i++) {
  clickedp1[i] = [];
  for(var j=0; j<8; j++) {
      clickedp1[i][j] = 0;
  }
}

var clickedp2 = [];
for(var i=0; i<6; i++) {
  clickedp2[i] = [];
  for(var j=0; j<8; j++) {
      clickedp2[i][j] = 0;
  }
}

// initializing gysahl green matrices

var gysahlp1 = [];
for(var i=0; i<6; i++) {
 gysahlp1[i] = [];
  for(var j=0; j<8; j++) {
      gysahlp1[i][j] = 0;
  }
}

var gysahlp2 = [];
for(var i=0; i<6; i++) {
  gysahlp2[i] = [];
  for(var j=0; j<8; j++) {
      gysahlp2[i][j] = 0;
  }
}

//game variables
var turn = 1;
var exploded = 0;
var animating = 0;
var cameramoving = 0;
var doneloading = 0;

var minemodels = [];

const idToPatchp1 = {};
const idToPatchp2 = {};

//animations

var tween1=[];
var tween2=[];
var tween3=[];
var tween4=[];
var tween5=[];
var groupChocobo1 = new TWEEN.Group();
var groupChocobo2 = new TWEEN.Group();
var groupCamera1 = new TWEEN.Group();
var groupCamera2 = new TWEEN.Group();

//main function

function main() {

  //setting up the scene
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 58);
  camera.lookAt(0, -10, -5);
  
  const scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();
  loader.load('./../textures/cloud-background-1.jpg' , function(texture){
    scene.background = texture;  
  });
  const fogColor = new THREE.Color(0x969696);
  scene.fog = new THREE.Fog(fogColor, 40, 100);
  const pickingScenep1 = new THREE.Scene();
  pickingScenep1.background = new THREE.Color(0);

  const pickingScenep2 = new THREE.Scene();
  pickingScenep2.background = new THREE.Color(0);

  //grass plane
 {
    const planeSize = 80;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('../textures/grass.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow=true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  //grid for the field 1
  var longsize = 16;
  var shortsize = 12;
  var step = 4;

  var grid = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({color: 'black'});

  for (var i = - shortsize; i<=shortsize; i += step){
    grid.vertices.push(new THREE.Vector3(- longsize, 0.04, i+step+20));
    grid.vertices.push(new THREE.Vector3( longsize, 0.04, i+step+20));
  }
  for (var i= -longsize; i<=longsize; i+=step){
    grid.vertices.push(new THREE.Vector3(i, 0.04, -shortsize+step+20));
    grid.vertices.push(new THREE.Vector3(i, 0.04, shortsize+step+20));
  }

  //grid for the field 2
  var grid1 = new THREE.Geometry();
  var material1 = new THREE.LineBasicMaterial({color: 'black'});

  for (var i = - shortsize; i<=shortsize; i += step){
    grid1.vertices.push(new THREE.Vector3(- longsize, 0.04, i+step-28));
    grid1.vertices.push(new THREE.Vector3( longsize, 0.04, i+step-28));
  }
  for (var i= -longsize; i<=longsize; i+=step){
    grid1.vertices.push(new THREE.Vector3(i, 0.04, -shortsize+step-28));
    grid1.vertices.push(new THREE.Vector3(i, 0.04, shortsize+step-28));
  }

  //field plane 1, divided in patches 
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../textures/ground.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;

    var id=1;
    for (var i = - shortsize; i<shortsize; i += step){
      for (var j= -longsize; j<longsize; j+=step){

        const planeGeo = new THREE.PlaneBufferGeometry(step, step);
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.position.set(j+step/2,0.02,i+step+step/2+20);
        mesh.receiveShadow=true;
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
        idToPatchp1[id] = mesh;
        id+=1;

        const pickingMaterial = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(id),
          color: new THREE.Color(0, 0, 0),
          specular: new THREE.Color(0, 0, 0),
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          blending: THREE.NoBlending,
        });
        const pickingPatch = new THREE.Mesh(planeGeo, pickingMaterial);
        pickingScenep1.add(pickingPatch);
        pickingPatch.position.copy(mesh.position);
        pickingPatch.rotation.copy(mesh.rotation);
        pickingPatch.scale.copy(mesh.scale);
      }
    }
  }
  
  //field plane 2, divided in patches 
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../textures/ground.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;

    var id=1;
    for (var i = - shortsize; i<shortsize; i += step){
      for (var j= -longsize; j<longsize; j+=step){

        const planeGeo = new THREE.PlaneBufferGeometry(step, step);
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.position.set(j+step/2,0.02,i+step+step/2-28);
        mesh.receiveShadow=true;
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
        idToPatchp2[id] = mesh;
        id+=1;

        const pickingMaterial = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(id),
          color: new THREE.Color(0, 0, 0),
          specular: new THREE.Color(0, 0, 0),
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.5,
          blending: THREE.NoBlending,
        });
        const pickingPatch = new THREE.Mesh(planeGeo, pickingMaterial);
        pickingScenep2.add(pickingPatch);
        pickingPatch.position.copy(mesh.position);
        pickingPatch.rotation.copy(mesh.rotation);
        pickingPatch.scale.copy(mesh.scale);
      }
    }
  }
  

  class GPUPickHelper {
    constructor() {
      // create a 1x1 pixel render target
      this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
      this.pixelBuffer = new Uint8Array(4);
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }

    //patch hover 
    pick1(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );
      
      if(id!=0 && clickedp1[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp1[id-1];
        if (intersectedObject) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObject;
          // save its color
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to yellow
          this.pickedObject.material.emissive.setHex(0xFFFF00);
        }
      }
    }

    //patch hover 
    pick2(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );
      
      if(id!=0 && clickedp2[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp2[id-1];
        if (intersectedObject) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObject;
          // save its color
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to yellow
          this.pickedObject.material.emissive.setHex(0xFFFF00);
        }
      }
    }

    //patch click
    click1(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );

      if(id!=0 && clickedp1[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp1[id-1];
        if (intersectedObject) {
          if(minesp1[Math.floor((id-2)/8)][(id-2)%8]==0){
            clickedp1[Math.floor((id-2)/8)][(id-2)%8]=1;
            plantGysahl(Math.floor((id-2)/8) - 3,(id-2)%8 - 4, 20);
            turn=4;
          }
          else{
            exploded=1;
            explode(Math.floor((id-2)/8) - 3,(id-2)%8 - 4);
          }
        }
      }
    }

    //patch click
    click2(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );

      if(id!=0 && clickedp2[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp2[id-1];
        if (intersectedObject) {
          if(minesp2[Math.floor((id-2)/8)][(id-2)%8]==0){
            clickedp2[Math.floor((id-2)/8)][(id-2)%8]=1;
            plantGysahl(Math.floor((id-2)/8) - 3,(id-2)%8 - 4, -28);
            turn=3;     
          }
          else{
            exploded=2;
            explode(Math.floor((id-2)/8) - 3,(id-2)%8 - 4);
          }
        }
      }
    }

    //patch hover when placing mines
    pickmines1(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );
      
      if(id!=0 && minesp1[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp1[id-1];
        if (intersectedObject) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObject;
          // save its color
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to yellow
          this.pickedObject.material.emissive.setHex(0xFFFF00);
        }
      }
    }

    //patch hover when placing mines
    pickmines2(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );
      
      if(id!=0 && minesp2[Math.floor((id-2)/8)][(id-2)%8]==0){
        const intersectedObject = idToPatchp2[id-1];
        if (intersectedObject) {
          // pick the first object. It's the closest one
          this.pickedObject = intersectedObject;
          // save its color
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to yellow
          this.pickedObject.material.emissive.setHex(0xFFFF00);
        }
      }
    }

    //patch click when placing mines 
    clickmines1(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );

      if(id!=0 && minesp1[Math.floor((id-2)/8)][(id-2)%8]==0 && nminesp1<5){
        const intersectedObject = idToPatchp1[id-1];
        if (intersectedObject) {
          minesp1[Math.floor((id-2)/8)][(id-2)%8]=1;
          setMine(Math.floor((id-2)/8) -3, (id-2)%8 -4, 20, nminesp1);
          nminesp1++;
          document.getElementById('mines').innerHTML="P1 mines positioned: "+nminesp1+"/5";
          if(nminesp1==5){
            setTimeout(function(){ 
              removeMines(nminesp1);
              turn=2;
              moveCamera(1);
              setTimeout(function(){
                document.getElementById('boxtitle').innerHTML="P1's turn";
                document.getElementById('boxtext').innerHTML="P1, it's your turn to set the mines in P2's field. You have five mines, and you can set them by clicking on the patch where you want to dig them. The currently selected patch will become yellow. To remember where you dug them, you decide to place rock mounds on top of them. The counter will tell you how many mines you have left. Be careful where you click, since you can't undo the positioning!";
                document.getElementById('mines').innerHTML="P2 mines positioned: 0/5";
                document.getElementById('popup_content_wrap').style.display='block';
              },1000);
            },1000);
          }
        }
      }
    }

    //patch click when placing mines
    clickmines2(cssPosition, scene, camera) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.getContext().drawingBufferWidth,   // full width
          renderer.getContext().drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,             // rect x
          cssPosition.y * pixelRatio | 0,             // rect y
          1,                                          // rect width
          1,                                          // rect height
      );
      // render the scene
      renderer.setRenderTarget(pickingTexture);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );

      if(id!=0 && minesp2[Math.floor((id-2)/8)][(id-2)%8]==0 && nminesp2<5){
        const intersectedObject = idToPatchp2[id-1];
        if (intersectedObject) {
          minesp2[Math.floor((id-2)/8)][(id-2)%8]=1;
          setMine(Math.floor((id-2)/8)-3, (id-2)%8-4, -28, nminesp2);
          nminesp2++;
          document.getElementById('mines').innerHTML="P2 mines positioned: "+nminesp2+"/5";
          if(nminesp2==5){
            setTimeout(function(){ 
              removeMines(nminesp2);
              turn=3;
              moveCamera(2);
              setTimeout(function(){
                popup_content('show', 'popup_content_wrap');
                document.getElementById('boxtitle').innerHTML="Everything is ready";
                document.getElementById('boxtext').innerHTML="Now that all the mines are set, it's time to play the game! You can see in the top left of the screen whose turn it is, and the planting happens in the exact same way the mines placing did. Good luck, and may the best farmer win!";
                document.getElementById('place_mines_pic').style.display='none';
                document.getElementById('done').style.display='none';
                document.getElementById('mines').style.display='none';
                document.getElementById('chest').style.display='none';
                document.getElementById('place_gysahl_pic').style.display='block';
                document.getElementById('ready').style.display='block';
                document.getElementById('turn').style.display='block';
                document.getElementById('start').style.display='block';
              },1000);
            },1000);
          }
        }
      }
    }
  }

//natural light
 var line = new THREE.LineSegments(grid, material);
 var line1 = new THREE.LineSegments(grid1, material1);
 scene.add(line);
 scene.add(line1);
  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  //light setting
  {
    const color = 0xB97A20;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(-20, 30, -10);
    light.target.position.set(20, 0, 5);

    light.shadow.bias = -0.004;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;

    scene.add(light);
    scene.add(light.target);
    const cam = light.shadow.camera;
    cam.near = 0;
    cam.far = 200;
    cam.left = -100;
    cam.right = 100;
    cam.top = 100;
    cam.bottom = -100;

    const cameraHelper = new THREE.CameraHelper(cam);
    scene.add(cameraHelper);
    cameraHelper.visible = false;
    const helper = new THREE.DirectionalLightHelper(light, 100);
    scene.add(helper);
    helper.visible = false;
  }

  /*function for printing the skeleton of the mesh, debugging use only

  function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }*/

  //function for traversing the skeleton of the mesh 

  function traverseTree(root, array ={}){
    if(root){
      array[root.name] = root;
      for(const obj of root.children){
        traverseTree(obj, array);
      }
      return array;
    }
  }

let armature, bones; 

//first chocobo
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/Chocobo2.0.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(2.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        root.position.y+= (size.y*0.5);
        root.position.z=8;

        armature = root.getObjectByName('Armature001');
        bones=traverseTree(armature,bones);

        //step 1
        tween1[0] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo1).to({x:0, y:0.1, z:3}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[1] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo1).to({z:-0.7}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[2] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo1).to({y:0.8, z:2.6}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[3] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo1).to({x:-1.4, z:0.5}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[4] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo1).to({y:0.65}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[5] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo1).to({x:-0.59}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween1[6] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo1).to({y:0.4}, 250).easing(TWEEN.Easing.Quadratic.In);

        //step 2, ready to chain
        tween1[7] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo1).to({x:0,y:-0.3, z:2}, 500);
        tween1[8] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo1).to({z:-1.6}, 500);
        tween1[9] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo1).to({x:1.8, y: 1.6, z:1.9}, 500);
        tween1[10] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo1).to({x: -1.4, z:0.9}, 500);
        tween1[11] = new TWEEN.Tween(bones['Footsx1'].rotation, groupChocobo1).to({y:-1.2}, 500);
        tween1[12] = new TWEEN.Tween(bones['Footsx2'].rotation, groupChocobo1).to({x:-0.5}, 500);
        tween1[13] = new TWEEN.Tween(bones['Footsx3'].rotation, groupChocobo1).to({x:2.6}, 500);
        tween1[14] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo1).to({y:0.22}, 500);
        tween1[15] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo1).to({x:-0.72}, 500);
        tween1[16] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo1).to({y:0.5}, 500);

        //step 3, ready to chain
        tween1[17] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo1).to({x:0, y:0.1, z:3}, 500);
        tween1[18] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo1).to({z:-0.7}, 500);
        tween1[19] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo1).to({x:1.28, y:0.8, z:2.6}, 500);
        tween1[20] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo1).to({x:-1.4, z:0.5}, 500);
        tween1[21] = new TWEEN.Tween(bones['Footsx1'].rotation, groupChocobo1).to({y:-0.18}, 500);
        tween1[22] = new TWEEN.Tween(bones['Footsx2'].rotation, groupChocobo1).to({x:-0.96}, 500);
        tween1[23] = new TWEEN.Tween(bones['Footsx3'].rotation, groupChocobo1).to({x:2.21}, 500);
        tween1[24] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo1).to({y:0.65}, 500);
        tween1[25] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo1).to({x:-0.59}, 500);
        tween1[26] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo1).to({y:0.4}, 500);


        tween1[0].chain(tween1[7], tween1[8], tween1[9], tween1[10],tween1[11],tween1[12],tween1[13], tween1[14], tween1[15], tween1[16]);
        tween1[7].chain(tween1[17], tween1[18], tween1[19], tween1[20],tween1[21],tween1[22],tween1[23], tween1[24], tween1[25], tween1[26]);
        tween1[17].chain(tween1[7], tween1[8], tween1[9], tween1[10],tween1[11],tween1[12],tween1[13], tween1[14], tween1[15], tween1[16]);

        tween1[27] = new TWEEN.Tween(root.position, groupChocobo1).to({z:9,y:1.3}, 250);
        tween1[28] = new TWEEN.Tween(root.position, groupChocobo1).to({z:10,y:1.2}, 250);
        tween1[29] = new TWEEN.Tween(root.position, groupChocobo1).to({z:11,y:1.3}, 250);
        tween1[30] = new TWEEN.Tween(root.position, groupChocobo1).to({z:12,y:1.2}, 250);
        tween1[31] = new TWEEN.Tween(root.position, groupChocobo1).to({z:13,y:1.3}, 250);
        tween1[32] = new TWEEN.Tween(root.position, groupChocobo1).to({z:14,y:1.2}, 250);
        tween1[33] = new TWEEN.Tween(root.position, groupChocobo1).to({z:15,y:1.3}, 250);
        tween1[34] = new TWEEN.Tween(root.position, groupChocobo1).to({z:16,y:1.2}, 250);
        tween1[35] = new TWEEN.Tween(root.position, groupChocobo1).to({z:17,y:1.3}, 250);
        tween1[36] = new TWEEN.Tween(root.position, groupChocobo1).to({z:18,y:1.2}, 250);
        tween1[37] = new TWEEN.Tween(root.position, groupChocobo1).to({z:19,y:1.3}, 250);
        tween1[38] = new TWEEN.Tween(root.position, groupChocobo1).to({z:20,y:1.2}, 250);
        tween1[39] = new TWEEN.Tween(root.position, groupChocobo1).to({z:21,y:1.3}, 250);
        tween1[40] = new TWEEN.Tween(root.position, groupChocobo1).to({z:22,y:1.2}, 250);
        tween1[41] = new TWEEN.Tween(root.position, groupChocobo1).to({z:23,y:1.3}, 250);
        tween1[42] = new TWEEN.Tween(root.position, groupChocobo1).to({z:24,y:1.2}, 250);
        tween1[43] = new TWEEN.Tween(root.position, groupChocobo1).to({z:25,y:1.3}, 250);
        tween1[44] = new TWEEN.Tween(root.position, groupChocobo1).to({z:26,y:1.2}, 250);
        tween1[45] = new TWEEN.Tween(root.position, groupChocobo1).to({z:27,y:1.3}, 250);
        tween1[46] = new TWEEN.Tween(root.position, groupChocobo1).to({z:28,y:1.2}, 250);
        tween1[47] = new TWEEN.Tween(root.position, groupChocobo1).to({z:29,y:1.3}, 250);
        tween1[48] = new TWEEN.Tween(root.position, groupChocobo1).to({z:30,y:1.2}, 250);
        tween1[49] = new TWEEN.Tween(root.position, groupChocobo1).to({z:31,y:1.3}, 250);
        tween1[50] = new TWEEN.Tween(root.position, groupChocobo1).to({z:32,y:1.2}, 250);
        tween1[51] = new TWEEN.Tween(root.position, groupChocobo1).to({z:33,y:1.3}, 250);
        tween1[52] = new TWEEN.Tween(root.position, groupChocobo1).to({z:34,y:1.2}, 250);
        tween1[53] = new TWEEN.Tween(root.position, groupChocobo1).to({z:35,y:1.3}, 250);
        tween1[54] = new TWEEN.Tween(root.position, groupChocobo1).to({z:36,y:1.2}, 250);
        tween1[55] = new TWEEN.Tween(root.position, groupChocobo1).to({z:37,y:1.3}, 250);
        tween1[56] = new TWEEN.Tween(root.position, groupChocobo1).to({z:38,y:1.2}, 250);
        tween1[57] = new TWEEN.Tween(root.position, groupChocobo1).to({z:39,y:1.3}, 250).onComplete(function(){groupChocobo1.removeAll()});
        tween1[27].chain(tween1[28]);
        tween1[28].chain(tween1[29]);
        tween1[29].chain(tween1[30]);
        tween1[30].chain(tween1[31]);
        tween1[31].chain(tween1[32]);
        tween1[32].chain(tween1[33]);
        tween1[33].chain(tween1[34]);
        tween1[34].chain(tween1[35]);
        tween1[35].chain(tween1[36]);
        tween1[36].chain(tween1[37]);
        tween1[37].chain(tween1[38]);
        tween1[38].chain(tween1[39]);
        tween1[39].chain(tween1[40]);
        tween1[40].chain(tween1[41]);
        tween1[41].chain(tween1[42]);
        tween1[42].chain(tween1[43]);
        tween1[43].chain(tween1[44]);
        tween1[44].chain(tween1[45]);
        tween1[45].chain(tween1[46]);
        tween1[46].chain(tween1[47]);
        tween1[47].chain(tween1[48]);
        tween1[48].chain(tween1[49]);
        tween1[49].chain(tween1[50]);
        tween1[50].chain(tween1[51]);
        tween1[51].chain(tween1[52]);
        tween1[52].chain(tween1[53]);
        tween1[53].chain(tween1[54]);
        tween1[54].chain(tween1[55]);
        tween1[55].chain(tween1[56]);
        tween1[56].chain(tween1[57]);
      });
  }

  //second chocobo
  
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/Chocobo2.0.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);
      
      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(2.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        root.position.y+= (size.y*0.5);
        root.position.z= -8;
        root.rotation.y+= (Math.PI);

        
        armature = root.getObjectByName('Armature001');
        bones=traverseTree(armature,bones);

        //step 1
        tween2[0] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo2).to({x:0, y:0.1, z:3}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[1] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo2).to({z:-0.7}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[2] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo2).to({y:0.8, z:2.6}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[3] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo2).to({x:-1.4, z:0.5}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[4] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo2).to({y:0.65}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[5] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo2).to({x:-0.59}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween2[6] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo2).to({y:0.4}, 250).easing(TWEEN.Easing.Quadratic.In);

        //step 2, ready to chain
        tween2[7] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo2).to({x:0,y:-0.3, z:2}, 500);
        tween2[8] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo2).to({z:-1.6}, 500);
        tween2[9] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo2).to({x:1.8, y: 1.6, z:1.9}, 500);
        tween2[10] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo2).to({x: -1.4, z:0.9}, 500);
        tween2[11] = new TWEEN.Tween(bones['Footsx1'].rotation, groupChocobo2).to({y:-1.2}, 500);
        tween2[12] = new TWEEN.Tween(bones['Footsx2'].rotation, groupChocobo2).to({x:-0.5}, 500);
        tween2[13] = new TWEEN.Tween(bones['Footsx3'].rotation, groupChocobo2).to({x:2.6}, 500);
        tween2[14] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo2).to({y:0.22}, 500);
        tween2[15] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo2).to({x:-0.72}, 500);
        tween2[16] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo2).to({y:0.5}, 500);

        //step 3, ready to chain
        tween2[17] = new TWEEN.Tween(bones['Legsx1'].rotation, groupChocobo2).to({x:0, y:0.1, z:3}, 500);
        tween2[18] = new TWEEN.Tween(bones['Legsx2'].rotation, groupChocobo2).to({z:-0.7}, 500);
        tween2[19] = new TWEEN.Tween(bones['Legdx1'].rotation, groupChocobo2).to({x:1.28, y:0.8, z:2.6}, 500);
        tween2[20] = new TWEEN.Tween(bones['Legdx2'].rotation, groupChocobo2).to({x:-1.4, z:0.5}, 500);
        tween2[21] = new TWEEN.Tween(bones['Footsx1'].rotation, groupChocobo2).to({y:-0.18}, 500);
        tween2[22] = new TWEEN.Tween(bones['Footsx2'].rotation, groupChocobo2).to({x:-0.96}, 500);
        tween2[23] = new TWEEN.Tween(bones['Footsx3'].rotation, groupChocobo2).to({x:2.21}, 500);
        tween2[24] = new TWEEN.Tween(bones['Footdx1'].rotation, groupChocobo2).to({y:0.65}, 500);
        tween2[25] = new TWEEN.Tween(bones['Footdx2'].rotation, groupChocobo2).to({x:-0.59}, 500);
        tween2[26] = new TWEEN.Tween(bones['Footdx3'].rotation, groupChocobo2).to({y:0.4}, 500);


        tween2[0].chain(tween2[7], tween2[8], tween2[9], tween2[10],tween2[11],tween2[12],tween2[13], tween2[14], tween2[15], tween2[16]);
        tween2[7].chain(tween2[17], tween2[18], tween2[19], tween2[20],tween2[21],tween2[22],tween2[23], tween2[24], tween2[25], tween2[26]);
        tween2[17].chain(tween2[7], tween2[8], tween2[9], tween2[10],tween2[11],tween2[12],tween2[13], tween2[14], tween2[15], tween2[16]);

        tween2[27] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-9,y:1.3}, 250);
        tween2[28] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-10,y:1.2}, 250);
        tween2[29] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-11,y:1.3}, 250);
        tween2[30] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-12,y:1.2}, 250);
        tween2[31] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-13,y:1.3}, 250);
        tween2[32] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-14,y:1.2}, 250);
        tween2[33] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-15,y:1.3}, 250);
        tween2[34] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-16,y:1.2}, 250);
        tween2[35] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-17,y:1.3}, 250);
        tween2[36] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-18,y:1.2}, 250);
        tween2[37] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-19,y:1.3}, 250);
        tween2[38] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-20,y:1.2}, 250);
        tween2[39] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-21,y:1.3}, 250);
        tween2[40] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-22,y:1.2}, 250);
        tween2[41] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-23,y:1.3}, 250);
        tween2[42] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-24,y:1.2}, 250);
        tween2[43] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-25,y:1.3}, 250);
        tween2[44] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-26,y:1.2}, 250);
        tween2[45] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-27,y:1.3}, 250);
        tween2[46] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-28,y:1.2}, 250);
        tween2[47] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-29,y:1.3}, 250);
        tween2[48] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-30,y:1.2}, 250);
        tween2[49] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-31,y:1.3}, 250);
        tween2[50] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-32,y:1.2}, 250);
        tween2[51] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-33,y:1.3}, 250);
        tween2[52] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-34,y:1.2}, 250);
        tween2[53] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-35,y:1.3}, 250);
        tween2[54] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-36,y:1.2}, 250);
        tween2[55] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-37,y:1.3}, 250);
        tween2[56] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-38,y:1.2}, 250);
        tween2[57] = new TWEEN.Tween(root.position, groupChocobo2).to({z:-39,y:1.3}, 250).onComplete(function(){groupChocobo2.removeAll()});
        tween2[27].chain(tween2[28]);
        tween2[28].chain(tween2[29]);
        tween2[29].chain(tween2[30]);
        tween2[30].chain(tween2[31]);
        tween2[31].chain(tween2[32]);
        tween2[32].chain(tween2[33]);
        tween2[33].chain(tween2[34]);
        tween2[34].chain(tween2[35]);
        tween2[35].chain(tween2[36]);
        tween2[36].chain(tween2[37]);
        tween2[37].chain(tween2[38]);
        tween2[38].chain(tween2[39]);
        tween2[39].chain(tween2[40]);
        tween2[40].chain(tween2[41]);
        tween2[41].chain(tween2[42]);
        tween2[42].chain(tween2[43]);
        tween2[43].chain(tween2[44]);
        tween2[44].chain(tween2[45]);
        tween2[45].chain(tween2[46]);
        tween2[46].chain(tween2[47]);
        tween2[47].chain(tween2[48]);
        tween2[48].chain(tween2[49]);
        tween2[49].chain(tween2[50]);
        tween2[50].chain(tween2[51]);
        tween2[51].chain(tween2[52]);
        tween2[52].chain(tween2[53]);
        tween2[53].chain(tween2[54]);
        tween2[54].chain(tween2[55]);
        tween2[55].chain(tween2[56]);
        tween2[56].chain(tween2[57]);
    });
  }

  //first farm house

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/House/scene.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(13.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        root.position.y+= (size.y*0.5);
        root.position.z+= (size.z*0.5);
    });
  }

    //second farm house

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/House/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(13.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*0.1);
          root.position.y+= (size.y*0.5);
          root.position.z-= (size.z*0.6);
          root.rotation.y+= (Math.PI);
      });
    }

    //tree 1 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/old_tree/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(50.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x*0.55);
          root.position.y+= (size.y*0.15);
          root.position.z+= (size.z*0.4);
          root.rotation.y+= (Math.PI);
      });
    }
  
    //tree 2 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/old_tree/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(40.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*0.7);
          root.position.y+= (size.y*0.2);
          root.position.z-= (size.z*0.7);
          root.rotation.y-= (Math.PI/2);
      });
    }

    //fence 1 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
         // root.position.x+= (size.x*0.7);
          root.position.y+= (size.y*0.2);
      });
    }

    //fence 2 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x);
          root.position.y+= (size.y*0.2);
      });
    }

    //fence 3 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*2);
          root.position.y+= (size.y*0.2);
      });
    }
    
    //fence 4 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*3);
          root.position.y+= (size.y*0.2);
      });
    }

    //fence 5 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x);
          root.position.y+= (size.y*0.2);
      });
    }

    //fence 6 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x*2);
          root.position.y+= (size.y*0.2);
      });
    }
    
    //fence 7 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/fence/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(10.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x*3);
          root.position.y+= (size.y*0.2);
      });
    }

    //bush 1 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/bush/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*6);
          root.position.y+= (size.y*0.4);
      });
    }

    //bush 2 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/bush/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x*6);
          root.position.y+= (size.y*0.4);
      });
    }


    //well 1 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/old_well/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x+= (size.x*6);
          root.position.y+= (size.y*0.4);
          root.position.z+= (size.z*6);
          root.rotation.y-= (Math.PI/3);
      });
    }

    //well 2 for decoration

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/old_well/scene.gltf', (gltf) => {
        const root = gltf.scene;
  
        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
  
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.x-= (size.x*6);
          root.position.y+= (size.y*0.4);
          root.position.z-= (size.z*6);
          root.rotation.y+= (Math.PI/3);
      });
    }

    
    //dummy loaders for future models
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/turnip/scene.gltf', (gltf) => {
        const root = gltf.scene;

        scene.add(root);
        dummy[0]=root;
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.z+= 100;
      });
    }

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/rocks/scene.gltf', (gltf) => {
        const root = gltf.scene;

        scene.add(root);
        dummy[1]=root;
  
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.z+= 100;
      });
    }

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../models/Quina.gltf', (gltf) => {
        const root = gltf.scene;

        scene.add(root);
        dummy[2]=root;
        
        // compute the box that contains all the stuff
        // from root and below
          const box = new THREE.Box3().setFromObject(root);
  
          const size = box.getSize(new THREE.Vector3());
          const boxCenter = box.getCenter(new THREE.Vector3());
  
          //Rescale the object to normalized space
          var maxAxis = Math.max(size.x, size.y, size.z);
          root.scale.multiplyScalar(7.0/maxAxis);
          box.setFromObject(root);
          box.getCenter(boxCenter);
          box.getSize(size);
          //Reposition to 0,halfY,0
          root.position.copy(boxCenter).multiplyScalar(-1);
          root.position.z+= 100;
      });
    }

  //setting the render size

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  

const pickPosition = {x: 0, y: 0};
const pickHelperp1 = new GPUPickHelper();
const pickHelperp2 = new GPUPickHelper();
clearPickPosition();

  //function for moving the camera
  function moveCamera(n){
    if (n==1){
      cameramoving=1;
      tween4[0] = new TWEEN.Tween(camera.position, groupCamera1).to({x:0, y:20, z:-58}, 1000).start().onUpdate(function(){camera.lookAt(0,-10, 5);}).onComplete(function(){cameramoving=0; tween4=[]; groupCamera1.removeAll();});
      setTimeout(function(){
        document.getElementById('turn').innerHTML="P2's turn";
      },1000);    
    }
    else if (n==2){
      cameramoving=2;
      tween5[0] = new TWEEN.Tween(camera.position, groupCamera2).to({x:0, y:20, z:58}, 1000).start().onUpdate(function(){camera.lookAt(0,-10, -5);}).onComplete(function(){cameramoving=0; tween5=[]; groupCamera2.removeAll();});
      setTimeout(function(){
        document.getElementById('turn').innerHTML="P1's turn";
      },1000); 
    }
  }

  //function for planting the mine
  function setMine(i, j, z, n){
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/rocks/scene.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);

      minemodels[n]=root;

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(2.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        root.position.set(step*j+step/2,0.1,step*i+step+step/2+z);
        root.rotation.z-=(Math.PI/2);
    });
  }

  //function for removing the mines
  function removeMines(n){
    for(var i=0; i<n; i++){
      scene.remove(minemodels[i]);
    }
    minemodels=[];
  }
  
  //function for planting a gysahl green
  function plantGysahl(i, j, z){
    animating=1;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/Quina.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(3.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        if(z==20){
          root.position.set(step*j+step/2,0.4,step*i+step+step/4+z);
        }
        else if (z==-28){
          root.position.set(step*j+step/2,0.4,step*i+step+3*step/4+z);
          root.rotation.y+= (Math.PI);
        }
      
        armature = root.getObjectByName('Armature');
        bones=traverseTree(armature,bones);
  
        //in position 
        tween3[0] = new TWEEN.Tween(bones['Body'].rotation).to({z:0.7}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[1] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[2] = new TWEEN.Tween(bones['Armdx3'].rotation).to({y:-1.1, z:2}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[3] = new TWEEN.Tween(bones['Armsx2'].rotation).to({y:-0.6, z:-2.3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[4] = new TWEEN.Tween(bones['Armsx3'].rotation).to({x:-0.5, y:0, z:0.3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[5] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:1, y:-1, z:1}, 500).start().easing(TWEEN.Easing.Quadratic.In);
  
        
        //digging and planting
        tween3[6] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-2.6}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween3[7] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-3}, 500);
        tween3[8] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-2.6}, 250).easing(TWEEN.Easing.Quadratic.In);
        tween3[9] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-3}, 500);
        tween3[10] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:0.5}, 250);
        tween3[11] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:1}, 250);
        tween3[12] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:0.5}, 250);
        tween3[13] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:1}, 250);
        tween3[14] = new TWEEN.Tween(bones['Armsx2'].rotation).to({y:0.6, z:-2.3}, 500).easing(TWEEN.Easing.Quadratic.In);
        tween3[15] = new TWEEN.Tween(bones['Armsx3'].rotation).to({x:-0.5, y:0, z:0.5}, 500).easing(TWEEN.Easing.Quadratic.In).onComplete(function(){setTimeout(function(){scene.remove(root); tween3=[]; TWEEN.removeAll(); animating=0;},500);});
  
  
        tween3[0].chain(tween3[6],tween3[10]);
        tween3[6].chain(tween3[7]);
        tween3[7].chain(tween3[8]);
        tween3[8].chain(tween3[9]);
        tween3[10].chain(tween3[11]);
        tween3[11].chain(tween3[12]);
        tween3[12].chain(tween3[13]);
        tween3[13].chain(tween3[14], tween3[15]);

    });

    setTimeout(function(){  
    const gltfLoader2 = new GLTFLoader();
      gltfLoader2.load('../models/turnip/scene.gltf', (gltf) => {
        const root = gltf.scene;

        root.traverse((obj) => {
          if (obj.castShadow !== undefined) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(2.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        root.position.set(step*j+step/2,0.02,step*i+step+step/2+z);

        if(z==20){
          root.rotation.y+=(Math.PI);
          gysahlp1[i+3][j+4] = root;
          setTimeout(function(){
            moveCamera(1);
          },500);
        }
        else if (z==-28){
          gysahlp2[i+3][j+4] = root;
          setTimeout(function(){
            moveCamera(2);
          },500);
        }
      });
    },2000);
}

function moveGysahl(mat,x){
  if(x==1){
    if(mat){
      setTimeout(function(){
        for(var i=0; i<6; i++){
          if(mat[i]){
            for(var j=0; j<8;j++){
              if (mat[i][j]!=0){
                const aux = mat[i][j];
                var tween = new TWEEN.Tween(mat[i][j].position, groupChocobo1).to({y:2}, 500).delay(1000*i).start().onComplete(function(){setTimeout(function(){scene.remove(aux)},500);});
              }
            }
          }
        } 
      },1500);
    }
  }
  else if(x==2){
    if(mat){
      setTimeout(function(){
        for(var i=5; i>-1; i--){
          if(mat[i]){
            for(var j=7; j>-1;j--){
              if (mat[i][j]!=0){
                const aux = mat[i][j];
                var tween = new TWEEN.Tween(mat[i][j].position, groupChocobo2).to({y:2}, 500).delay(1000*(5-i)).start().onComplete(function(){setTimeout(function(){scene.remove(aux)},500);});
              }
            }
          }
        } 
      },1500);
    }
  }
}

//function when you lose
function explode(i, j){
  document.getElementById('home').classList.remove('image');
  document.getElementById('home').onclick=function(){return false};
  document.getElementById('audioon').classList.remove('image');
  document.getElementById('audioon').onclick=function(){return false};
  document.getElementById('audiooff').classList.remove('image');
  document.getElementById('audiooff').onclick=function(){return false};

  animating=1;
  const gltfLoader = new GLTFLoader();
    gltfLoader.load('../models/Quina.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const size = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        root.scale.multiplyScalar(3.0/maxAxis);
        box.setFromObject(root);
        box.getCenter(boxCenter);
        box.getSize(size);
        //Reposition to 0,halfY,0
        root.position.copy(boxCenter).multiplyScalar(-1);
        if(exploded==1){
          root.position.set(step*j+step/2,0.4,step*i+step+step/4+20);
        }
        else if (exploded==2){
          root.position.set(step*j+step/2,0.4,step*i+step+3*step/4-28);
          root.rotation.y+= (Math.PI);
        }
      
        armature = root.getObjectByName('Armature');
        bones=traverseTree(armature,bones);
        
  
        //in position 
        tween3[0] = new TWEEN.Tween(bones['Body'].rotation).to({z:0.7}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[1] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[2] = new TWEEN.Tween(bones['Armdx3'].rotation).to({y:-1.1, z:2}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[3] = new TWEEN.Tween(bones['Armsx2'].rotation).to({y:-0.6, z:-2.3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[4] = new TWEEN.Tween(bones['Armsx3'].rotation).to({x:-0.5, y:0, z:0.3}, 500).start().easing(TWEEN.Easing.Quadratic.In);
        tween3[5] = new TWEEN.Tween(bones['Handsx'].rotation).to({x:1, y:-1, z:1}, 500).start().easing(TWEEN.Easing.Quadratic.In);
  
        
        //digging
        tween3[6] = new TWEEN.Tween(bones['Armdx2'].rotation).to({z:-2.6}, 250).easing(TWEEN.Easing.Quadratic.In).onComplete(function(){scene.remove(root); tween3=[]; TWEEN.removeAll(); animating=0;});

        tween3[0].chain(tween3[6]);
      });

  setTimeout(function(){
    stop();

    const planeSize = 80;

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      opacity: 0,
      transparent:true,
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    var current = {
      opacity: 0
    };

    if(exploded==1){
      mesh.position.z = planeSize/2;
      tween1[58] = new TWEEN.Tween(current, groupChocobo1).to({opacity: 1}, 2000).onUpdate(function(){mesh.material.opacity = current.opacity;}).start();
      tween1[59] = new TWEEN.Tween(current, groupChocobo1).to({opacity: 0}, 2000).onUpdate(function(){mesh.material.opacity = current.opacity;});
      tween1[58].chain(tween1[59]);
    }
    else if (exploded==2){
      mesh.position.z = -planeSize/2;
      tween2[58] = new TWEEN.Tween(current, groupChocobo2).to({opacity: 1}, 2000).onUpdate(function(){mesh.material.opacity = current.opacity;}).start();
      tween2[59] = new TWEEN.Tween(current, groupChocobo2).to({opacity: 0}, 2000).onUpdate(function(){mesh.material.opacity = current.opacity;});
      tween2[58].chain(tween2[59]);
    }
    scene.add(mesh);
    document.getElementById('audio3').play(); 
    
    setTimeout(function(){ 
      document.getElementById('audio4').play(); 
      if(exploded==1){
        moveGysahl(gysahlp1,exploded);
        tween1[0].start();
        tween1[1].start();
        tween1[2].start();
        tween1[3].start();
        tween1[4].start();
        tween1[5].start();
        tween1[6].start();
        tween1[27].start();
        if(groupChocobo1.getAll()!=[]){
          setTimeout(function(){ 
            document.getElementById('boxtitle').innerHTML='The bomb exploded!';
            document.getElementById('boxtext').innerHTML="You triggered the trap set by your opponent! Now all your chocobos are lost, and your gysahl greens too... But don't worry, you can always try again!";
            document.getElementById('gohome').style.display='block';
            document.getElementById('retry').style.display='block';
            document.getElementById('ready').style.display='none';
            document.getElementById('start').style.display='none';
            document.getElementById('place_gysahl_pic').style.display='none';
            document.getElementById('lost').style.display='block';
            document.getElementById('popup_content_wrap').style.display='block';
          },8000);
        }
      }
      else if (exploded==2){
        moveGysahl(gysahlp2,exploded);
        tween2[0].start();
        tween2[1].start();
        tween2[2].start();
        tween2[3].start();
        tween2[4].start();
        tween2[5].start();
        tween2[6].start();
        tween2[27].start();
        if(groupChocobo2.getAll()!=[]){
          setTimeout(function(){ 
            document.getElementById('boxtitle').innerHTML='The bomb exploded!';
            document.getElementById('boxtext').innerHTML="You triggered the trap set by your opponent! Now all your chocobos are lost, and your gysahl greens too... But don't worry, you can always try again!";
            document.getElementById('gohome').style.display='block';
            document.getElementById('retry').style.display='block';
            document.getElementById('ready').style.display='none';
            document.getElementById('start').style.display='none';
            document.getElementById('place_gysahl_pic').style.display='none';
            document.getElementById('lost').style.display='block';
            document.getElementById('popup_content_wrap').style.display='block';
          },8000);
        }
      }
    },4000);
  },900);
}

  //rendering

  function render(time) {
    time *= 0.001;  // convert to seconds

    if (scene.children.length>=124 && doneloading==0){
      document.getElementById('loader_wrap').style.display='none';
      document.getElementById('popup_content_wrap').style.display='block';
      scene.remove(dummy[0]);
      scene.remove(dummy[1]);
      scene.remove(dummy[2]);
      doneloading=1;
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if(tween1.length==60 && exploded==1){
      groupChocobo1.update();
    }
    else if(tween2.length==60 && exploded==2){
      groupChocobo2.update();
    }
    else if (tween3.length==16||(tween3.length==7 && (exploded==1||exploded==2))){
      TWEEN.update();
    }

    if(tween4.length==1 && cameramoving==1){
      groupCamera1.update();
    }
    else if (tween5.length==1 && cameramoving==2){
      groupCamera2.update();
    }

    if(document.getElementById('popup_content_wrap').style.display=="none" && document.getElementById('done').style.display=='none' && exploded==0 && animating==0 && cameramoving==0){
      if(turn==3){
        pickHelperp1.pick1(pickPosition, pickingScenep1, camera);
      }
      if(turn==4){
        pickHelperp2.pick2(pickPosition, pickingScenep2, camera);
      }
    }

    else if(document.getElementById('popup_content_wrap').style.display=="none" && document.getElementById('done').style.display=='block' && cameramoving==0){
      if(turn==1 && nminesp1<5){
        pickHelperp1.pickmines1(pickPosition, pickingScenep1, camera);
      }

      if(turn==2 && nminesp2<5){
        pickHelperp2.pickmines2(pickPosition, pickingScenep2, camera);
      }
    }
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    renderer.render(scene, camera);
    
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = pos.x;
    pickPosition.y = pos.y;
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function click(){
    if(document.getElementById('popup_content_wrap').style.display=="none"&& exploded==0 && animating==0 && cameramoving==0){
      if(turn==1){
        pickHelperp1.clickmines1(pickPosition, pickingScenep1, camera);
      }
      if(turn==2){
        pickHelperp2.clickmines2(pickPosition, pickingScenep2, camera);
      }
      if(turn==3){
        pickHelperp1.click1(pickPosition, pickingScenep1, camera);
      }
      if(turn==4){
        pickHelperp2.click2(pickPosition, pickingScenep2, camera);
      }
    }
  }

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});

  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener('touchend', clearPickPosition);

  window.addEventListener('mousedown', click);
}

//initialize the window

main();