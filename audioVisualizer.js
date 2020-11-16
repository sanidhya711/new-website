/*
Copyright (c) 2017 - Misaki Nakano - https://codepen.io/mnmxmx/pen/mmZbPK/

Permission is hereby granted, free of charge, to any person 
obtaining a copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall 
be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

*/

// var windowW = window.innerWidth
// var windowH = Math.max(600, window.innerHeight);
var windowW = 375;
var windowH = 375;
var body = document.body;
body.classList.add("color");

window.onload = function(){
  var webgl = new Webgl();
  var audio = new Audio(webgl);
}

class Audio{
  constructor(_webgl){
    this.webgl = _webgl;
    this.source = null;
    this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
    this.fileReader  = new FileReader;
    this.init();
    this.isReady = false;
    this.count = 0;
    this.render();
  }
  
  init(){
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = 10;
    this.analyser.smoothingTimeConstant = .75;
    
    var roses;
    var peacock_affect;
    var rip_fredro;

    fetch('roses.mp3')
    .then(res => res.blob())
    .then(blob => {
      roses = blob;
    });
    
    fetch('peacock affect.mp3')
    .then(res => res.blob())
    .then(blob => {
      peacock_affect = blob;
    });

    fetch('rip fredro.mp3')
    .then(res => res.blob())
    .then(blob => {
      rip_fredro = blob;
    });

    var songs = ["rip_fredro remix","roses remix","peacock_affect remix"];
    var songNo = 1;    

    function next(){
      if(started){
        _this.source.removeEventListener("ended",next);
      }
      songNo = songNo+1 < songs.length ? songNo+1 : 0;
      document.getElementById("startVisualizer2").click();
      document.getElementById("tooltip").innerText=songs[songNo];
    }

    function prev(){
      if(started){
        _this.source.removeEventListener("ended",next);
      }
      songNo = songNo-1 >= 0 ? songNo-1 : songs.length-1;
      document.getElementById("startVisualizer2").click();
      document.getElementById("tooltip").innerText=songs[songNo];
    }

    document.getElementById("next").addEventListener("click",function(){
      next();
    });

    document.getElementById("prev").addEventListener("click",function(){
      prev();
    });
    

      document.addEventListener("keydown",function(eve){
        if(eve.keyCode==32){
          var activePage = fullpage_api.getActiveSection().anchor;
          if(activePage=='fifthPage'){
          document.getElementById("startVisualizer").click();
          }
        }
      });
    

  //volume slider bruhhh
    $("#volume").slider({
      min: 0,
      max: 100,
      value: 50,
        range: "min",
      slide: function(event, ui) {
        setVolume(ui.value / 100);
      }
    });

    var predefinedVolume = 0.5;
    var started = false;
    var hasGainBeenSet = false;
    var _volume = null;


    document.getElementById("vol-min").addEventListener("click",function(){
      _volume = 0;
      $("#volume").slider({value:0,});
      setVolume(0);
    });

    document.getElementById("vol-max").addEventListener("click",function(){
      _volume = 1;
      $("#volume").slider({value: 100,});
      setVolume(1);
    });

    document.getElementById("earRape").addEventListener("click",function(){
      if(_volume == 100){
        _volume = 1;
        $("#volume").slider({value: 100,});
        setVolume(1);
      }else{
        _volume = 100;
        $("#volume").slider({value: 100,});
        setVolume(100);
      }
    });

    //setting volume whenever updated
    function setVolume(volume){
      _volume = volume;
      if(hasGainBeenSet){
        _this.gainNode.gain.value = volume;
      }else{
        predefinedVolume = volume;
      }
    }

    document.getElementById("startVisualizer").addEventListener('click',function(){
      if(started){
        if(_this.audioContext.state === 'running') {
          _this.audioContext.suspend();
          _this.isReady=false;
        document.getElementById("startVisualizer").style.letterSpacing="1.9px";
          document.getElementById("startVisualizer").innerText="Play";
        } else if(_this.audioContext.state === 'suspended') {
          _this.audioContext.resume();
          _this.isReady=true;
          document.getElementById("startVisualizer").style.letterSpacing="1.1px";
          document.getElementById("startVisualizer").innerText="Pause";
        }
      }else{
        document.getElementById("startVisualizer2").click();
        document.getElementById("startVisualizer").style.letterSpacing="1.1px";
        document.getElementById("startVisualizer").innerText="Pause";
      }
    });

    document.getElementById('startVisualizer2').addEventListener('click', function(e){
      document.getElementById("hasTrackBeenLoaded").innerText="loading track...";
        started = true;
        if(songNo==0){
          this.fileReader.readAsArrayBuffer(rip_fredro);
        }else if(songNo==1){
          this.fileReader.readAsArrayBuffer(roses);
        }else{
          this.fileReader.readAsArrayBuffer(peacock_affect);
      }
    }.bind(this));

    var _this = this;
    
    this.fileReader.onload = function(){
      _this.audioContext.decodeAudioData(_this.fileReader.result, function(buffer){
        if(_this.source){
          _this.source.stop();
        }
        _this.source = _this.audioContext.createBufferSource();
        _this.source.buffer = buffer;
        
        _this.source.addEventListener("ended",next);


        _this.source.connect(_this.analyser);

        _this.gainNode = _this.audioContext.createGain();

        hasGainBeenSet = true;

        //setting volume
        if(_volume==null){
          _this.gainNode.gain.value = predefinedVolume;
        }else{
          _this.gainNode.gain.value = _volume;
        }
        
        _this.source.connect(_this.gainNode);
        _this.gainNode.connect(_this.audioContext.destination);
        _this.source.start(0);

        document.getElementById("hasTrackBeenLoaded").innerText="";
        _this.audioContext.resume();
        document.getElementById("startVisualizer").style.letterSpacing="1.1px";
        document.getElementById("startVisualizer").innerText="Pause";
        
        _this.frequencyArray = _this.webgl.sphereG.attributes.aFrequency.array;
        _this.indexPosArray = _this.webgl.indexPosArray;
        _this.indexPosLength = _this.webgl.indexPosArray.length;
        _this.isReady = true;
      });
    };
  }
  
  _render(){
    if(!this.isReady) return;
    this.count++;
    
    this.spectrums = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.spectrums);
    
    var num, mult, frequency, maxNum = 255, frequencyAvg = 0;
    
    for(var i = 0; i < this.indexPosLength; i++){
      mult = Math.floor(i / maxNum);
      
      if(mult % 2 === 0){
        num = i - maxNum * mult;
      } else {
        num = maxNum - (i - maxNum * mult);
      }
      
      var spectrum = (num > 150) ? 0 : this.spectrums[num + 20];
      frequencyAvg += spectrum * 1.2;

        var indexPos = this.indexPosArray[i];
        spectrum = Math.max(0, spectrum - i/80);
        
        for(var j = 0, len = indexPos.length; j < len; j++){
          var vectorNum = indexPos[j];
          this.frequencyArray[vectorNum] = spectrum;
        }
    }
    
    frequencyAvg /= this.indexPosLength;
    frequencyAvg*= 1.7;
    this.webgl.sphereM.uniforms["uScale"].value = this.webgl.sphereM_2.uniforms["uScale"].value = frequencyAvg * 1.7;
    this.webgl.sphereM.uniforms["uTime"].value += 0.015;
    
    this.webgl.mesh_2.scale.x = 1 + frequencyAvg / 290;
    this.webgl.mesh_2.scale.y = 1 + frequencyAvg / 290;
    this.webgl.mesh_2.scale.z = 1 + frequencyAvg / 290;
    
  }
  
  render(){
    this._render();
    this.webgl.render();
    requestAnimationFrame(this.render.bind(this))
  }
}

class Webgl{
  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, windowW / windowH, 0.1, 10000);
    this.camera.position.set(20, 130, -80);
    
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    
    this.renderer.setPixelRatio(1.5);
    
    this.renderer.setClearColor(0x20c5d4, 0);
    this.renderer.setSize(windowW, windowH);
    var div = document.getElementById("wrapperVisualizer");
    div.appendChild(this.renderer.domElement);
    // div.style.width = windowW + "px";
    // div.style.height = window.innerHeight + "px";
    
    this.renderer.domElement.style.width = windowW + "px";
    this.renderer.domElement.style.height = windowH + "px";
    
    
    
    var orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.windowW = windowW;
    this.windowH = window.innerHeight;
    
    this.mouse = {
      x: 0,
      y: 0,
      old_x: 0,
      old_y : 0
    }
    
//     document.addEventListener( 'mousemove', function(event){
//       this.mouse.old_x = this.mouse.x;
//       this.mouse.old_y = this.mouse.y;
      
//       this.mouse.x = event.clientX - this.windowW / 2;
//       this.mouse.y = event.clientY - this.windowH / 2;
//     }.bind(this), false );
    
    window.onresize = function() {
      this.windowW = 375;
      this.windowH = 375;
      // var _height = Math.max(600, this.windowH);
      var _height = 375;
      this.renderer.setSize(this.windowW, _height);
      this.camera.aspect = this.windowW / _height;
      this.camera.updateProjectionMatrix();
      
      // div.style.width = this.windowW + "px";
      // div.style.height = window.innerHeight + "px";
      
    }.bind(this);
    
    this.createSphere();
    
    this.renderer.render(this.scene, this.camera);
  }
  
  
  
  createSphere(){
    this.createShader();
    
    this.sphereG = new THREE.IcosahedronBufferGeometry(40, 4);
    this.sphereM = new THREE.ShaderMaterial({
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
      uniforms: {
        uTime: {type: "f", value: 0},
        uScale: {type: "f", value: 0},
        isBlack : {type: "i", value: 1}
        
      },
      wireframe: true,
      transparent: true
    });
    
    
    this.detectIndex();
    this.sphereG.addAttribute("aFrequency", new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1));
    
    this.mesh = new THREE.Mesh(this.sphereG, this.sphereM);
    
    this.scene.add(this.mesh);
    
    this.createSphere2();
  }
  
  
  createSphere2(){
    this.sphereG_2 = new THREE.IcosahedronBufferGeometry(39.5, 4);
    this.sphereG_2.addAttribute("aFrequency", new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1));
    this.sphereM_2 =  new THREE.ShaderMaterial({
      vertexShader: this.vertex_2,
      fragmentShader: this.fragment_2,
      uniforms: {
        uScale: {type: "f", value: 0},
        isBlack: {type: "i", value: 1}
      },

      shading: THREE.FlatShading
    });
    
    this.mesh_2 = new THREE.Mesh(this.sphereG_2, this.sphereM_2);
    this.scene.add(this.mesh_2);
  }
  
  
  detectIndex(){
    this.verticesArray = this.sphereG.attributes.position.array;
    var arrayLength = this.verticesArray.length;
    
    this.vecCount = 0;
    this.indexCount = 0;
    this.vec3Array = [];
    this.allVec3Array = [];
    this.indexArray = [];
    this.indexPosArray = []; 
    this.frequencyNumArray = [];
    
    for(var i = 0; i < arrayLength; i+= 3){
      var vec3 = {};
      vec3.x = this.verticesArray[i];
      vec3.y = this.verticesArray[i + 1];
      vec3.z = this.verticesArray[i + 2];
      var detect = this.detectVec(vec3);
      this.allVec3Array.push(vec3);
      
      if(detect === 0 || detect > 0){
        this.indexArray[this.indexCount] = detect;
        this.indexPosArray[detect].push(this.indexCount);
        
      } else {
        this.vec3Array[this.vecCount] = vec3;
        this.indexArray[this.indexCount] = this.vecCount;
        
        this.indexPosArray[this.vecCount] = [];
        this.indexPosArray[this.vecCount].push(this.indexCount);
        
        this.vecCount++;
        
      }

      this.indexCount++;
    }
  }
  
  
  detectVec(vec3){
    if(this.vecCount === 0) return false;
  
    for(var i = 0, len = this.vec3Array.length; i < len; i++){
      var _vec3 = this.vec3Array[i];
      var isExisted = vec3.x === _vec3.x && vec3.y === _vec3.y && vec3.z === _vec3.z;
      if(isExisted) {
        return i;
      }
    }

    return false;
  }
  
  createShader(){
    this.vertex = [
      "uniform float uTime;",
      "uniform float uScale;",
      
      "attribute float aFrequency;",
      "varying float vFrequency;",
      "varying float vPos;",
      
      
      "const float frequencyNum = 256.0;",
      "const float radius = 40.0;",
      "const float PI = 3.14159265;",
      "const float _sin15 = sin(PI / 10.0);",
      "const float _cos15 = cos(PI / 10.0);",
      
      "void main(){",
      
      "float frequency;",
      "float SquareF = aFrequency * aFrequency;",
      
      "frequency = smoothstep(16.0, 7200.0, SquareF) * SquareF / (frequencyNum * frequencyNum);",
      
      "vFrequency = frequency;",
      
      "float _uScale = (1.0 - uScale * 0.5 / frequencyNum) * 3.0;",
      
      "float _sin = sin(uTime * .5);",
      "float _cos = cos(uTime * .5);",
      
      
      "mat2 rot = mat2(_cos, -_sin, _sin, _cos);",
      "mat2 rot15 = mat2(_cos15, -_sin15, _sin15, _cos15);",
      
      "vec2 _pos = rot * position.xz;",
      "vec3 newPos = vec3(_pos.x, position.y, _pos.y);",
      "newPos.xy = rot15 * newPos.xy;",
      
      "newPos = (1.0 + uScale / (frequencyNum * 2.0) ) * newPos;",
      
      "vPos = (newPos.x + newPos.y + newPos.z) / (3.0 * 120.0);",
      
      
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos + vFrequency * newPos * _uScale, 1.0);",
      "}"
    ].join("\n");
    
    this.fragment = [
      "uniform float uTime;",
      "uniform float uScale;",
      
      "uniform int isBlack;",
      
      "varying float vFrequency;",
      "varying float vPos;",
      
      "const float frequencyNum = 256.0;",
      "const vec3 baseColor = vec3(0.95, 0.25, 0.3);",
      // "const vec3 baseColor = vec3(0.0, 0.65, 0.7);",
      
      
      
      
      "void main(){",
      "float f = smoothstep(0.0, 0.00002, vFrequency * vFrequency) * vFrequency;",
      "float red = min(1.0, baseColor.r + f * 1.9);",
      "float green = min(1.0, baseColor.g + f * 3.6);",
      "float blue = min(1.0, baseColor.b + f* 0.01);",
      "float sum = red + blue + green;",

      "blue = min(1.0, blue + 0.3);",
      "green = max(0.0, green - 0.1);",
      
      "float offsetSum = (sum - (red + blue + green) / 3.0) / 3.0;",
      
      "blue += offsetSum + min(vPos * 2.0, -0.2);",
      "red += offsetSum + min(vPos * 0.5, 0.2);",
      "green += offsetSum - vPos * max(0.3, vFrequency * 2.0);",
      
      "vec3 color;",

      "color = vec3(red, green, blue);",
      
      
      "gl_FragColor = vec4(color, 1.0);",
      "}"
    ].join("\n");
    
    //color: 0xff6673,
    this.vertex_2 = [
      "varying vec3 vPosition;",
      
      "void main(){",
      "vPosition = position;",
      "gl_Position =projectionMatrix * modelViewMatrix * vec4(position, 1.0);", 
      "}"
    ].join("\n");
    this.fragment_2 = [
      "uniform float uScale;",
      "uniform int isBlack;",
      
      
      "varying vec3 vPosition;",
      "const float frequencyNum = 256.0;",
      
      "const float radius = 40.0;",
      "const vec3 baseColor = vec3(1.0, 102.0 / 255.0, 115.0 / 255.0);",
      // "const vec3 baseColor = vec3(0.1, 0.8, 0.9);",
      
      
      
      
      "void main(){",
      "vec3 pos = vec3(vPosition.x, -vPosition.y, vPosition.z) / (radius * 10.0) + 0.05;",
      
      "vec3 _color;",

      "_color = baseColor + pos;",
      
      // "float _uScale = uScale / (frequencyNum * 5.0);",
      
      "gl_FragColor = vec4(_color, 1.0);",
      "}"
      
    ].join("\n")
  }
  
  render(){
    this.sphereG.attributes.aFrequency.needsUpdate = true;
    var d = this.mouse.x - this.mouse.old_x;
    var theta = d * 0.1;
    var sin = Math.sin(theta);
    var cos = Math.cos(theta);
    
    var x = this.camera.position.x;
    var z = this.camera.position.z;
    
    
    this.camera.position.x = x * cos - z * sin;
    this.camera.position.z = x * sin + z * cos;

    this.camera.lookAt( this.scene.position );
    
    this.renderer.render(this.scene, this.camera);
  }
}