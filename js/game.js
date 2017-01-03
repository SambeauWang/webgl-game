/**
 * Created by tlm on 2016/11/5.
 */

var color = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0
};

var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];
var particlesPool = [];
var particlesInUse = [];

var coinsHolder;

var scene, camera, width, height, fieldOfView, aspectRatio, nearPlane,
    farPlane, renderer, container, game;

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

function resetGame(){
    game = {speed:0,
        initSpeed:.00035,
        baseSpeed:.00035,
        targetBaseSpeed:.00035,
        incrementSpeedByTime:.0000025,
        incrementSpeedByLevel:.000005,
        distanceForSpeedUpdate:100,
        speedLastUpdate:0,

        distance:0,
        ratioSpeedDistance:50,
        energy:100,
        ratioSpeedEnergy:3,

        level:1,
        levelLastUpdate:0,
        distanceForLevelUpdate:1000,

        planeDefaultHeight:100,
        planeAmpHeight:80,
        planeAmpWidth:75,
        planeMoveSensivity:0.005,
        planeRotXSensivity:0.0008,
        planeRotZSensivity:0.0004,
        planeFallSpeed:.001,
        planeMinSpeed:1.2,
        planeMaxSpeed:1.6,
        planeSpeed:0,
        planeCollisionDisplacementX:0,
        planeCollisionSpeedX:0,

        planeCollisionDisplacementY:0,
        planeCollisionSpeedY:0,

        seaRadius:600,
        seaLength:800,
        //seaRotationSpeed:0.006,
        wavesMinAmp : 5,
        wavesMaxAmp : 20,
        wavesMinSpeed : 0.001,
        wavesMaxSpeed : 0.003,

        cameraFarPos:500,
        cameraNearPos:150,
        cameraSensivity:0.002,

        coinDistanceTolerance:15,
        coinValue:3,
        coinsSpeed:.5,
        coinLastSpawn:0,
        distanceForCoinsSpawn:100,

        ennemyDistanceTolerance:10,
        ennemyValue:10,
        ennemiesSpeed:.6,
        ennemyLastSpawn:0,
        distanceForEnnemiesSpawn:50,

        status : "playing",
    };
    fieldLevel.innerHTML = Math.floor(game.level);
}

var createScene = function () {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    fieldOfView = 60;
    aspectRatio = width/height;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    container = document.getElementById("world");
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
};

var hemisphereLight, shadowLight;
var createLights = function () {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    ambientLight = new THREE.AmbientLight(0xdc8874, .5);

    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);

    // var ch = new THREE.CameraHelper(shadowLight.shadow.camera);
    // scene.add(ch);
};

var handleWindowResize = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
};

Sea = function () {
    var geom = new THREE.CylinderGeometry(game.seaRadius,game.seaRadius,game.seaLength,40,10);
    // var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    geom.mergeVertices();
    this.waves = [];
    var l = geom.vertices.length;
    for(var i=0; i<l; i++){
        var v = geom.vertices[i];
        this.waves.push({
            y:v.y,
            x:v.x,
            z:v.z,
            ang: Math.random()*Math.PI*2,
            // amp: 5+Math.random()*15,
            // speed: 0.016+Math.random()*0.032,
            amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
            speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
        })
    }

    var mat = new THREE.MeshPhongMaterial({
        color: color.blue,
        transparent: true,
        opacity: 8,
        shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.name = "waves";
};

Sea.prototype.moveWaves = function () {
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;

    for (var i=0; i<l; i++){
        var v = verts[i];
        var vprops = this.waves[i];

        v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
        vprops.ang += vprops.speed*deltaTime;
        this.mesh.geometry.verticesNeedUpdate = true;
    }

    // sea.mesh.rotation.z += 0.005;
};

var sea;
var createSea = function () {
    sea = new Sea();
    sea.mesh.position.y = -game.seaRadius;
    scene.add(sea.mesh);
};

Cloud = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";

    // var geom = new THREE.BoxGeometry(20,20,20);
    var geom = new THREE.CubeGeometry(20,20,20);
    var mat = new THREE.MeshPhongMaterial({
        color: color.white,
    });

    var nBlocs = 3+Math.floor(Math.random()*3);
    for(var i=0; i<nBlocs; i++){
        var m = new THREE.Mesh(geom, mat);

        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.y = Math.random()*Math.PI*2;
        m.rotation.z = Math.random()*Math.PI*2;

        var s = .1 + Math.random()*.9;
        m.scale.set(s,s,s);

        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);
    }
};

Cloud.prototype.rotate = function () {
    var l = this.mesh.children.length;
    for(var i=0; i<l; i++){
        var m = this.mesh.children[i];
        m.rotation.z += Math.random()*0.005*(i+1);
        m.rotation.y += Math.random()*0.002*(i+1);
    }
};

Sky = function () {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;

    this.clouds = [];
    var stepAngle = Math.PI*2/this.nClouds;
    for(var i=0; i<this.nClouds; i++){
        var a = i*stepAngle;
        var c = new Cloud();
        this.clouds.push(c);
        var h = game.seaRadius + 150 + Math.random()*200;

        c.mesh.position.y = h*Math.sin(a);
        c.mesh.position.x = h*Math.cos(a);
        c.mesh.rotation.z = a + Math.PI/2;
        c.mesh.position.z = -300 - Math.random()*500;
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);

        this.mesh.add(c.mesh);
    }

};

Sky.prototype.moveClouds = function () {
    for(var i=0; i<this.nClouds; i++){
        var c = this.clouds[i];
        c.rotate();
    }
    this.mesh.rotation.z += game.speed*deltaTime;
};

var sky;
var createSky = function () {
    sky = new Sky();
    sky.mesh.position.y = -game.seaRadius;
    scene.add(sky.mesh);
};

var AirPlane = function () {
    this.mesh = new THREE.Object3D();

    var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1,1,1);
    var matCockpit = new THREE.MeshPhongMaterial({
        color: color.red,
        shading: THREE.FlatShading,
    });

    geomCockpit.vertices[4].y-=10;
    geomCockpit.vertices[4].z+=20;
    geomCockpit.vertices[5].y-=10;
    geomCockpit.vertices[5].z-=20;
    geomCockpit.vertices[6].y+=30;
    geomCockpit.vertices[6].z+=20;
    geomCockpit.vertices[7].y+=30;
    geomCockpit.vertices[7].z-=20;

    this.cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    this.cockpit.castShadow = true;
    this.cockpit.receiveShadow = true;
    this.mesh.add(this.cockpit);

    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1,1);
    var matEngine = new THREE.MeshPhongMaterial({
        color: color.white,
        shading: THREE.FlatShading,
    });

    this.engine = new THREE.Mesh(geomEngine, matEngine);
    this.engine.position.x = 40;
    this.engine.castShadow = true;
    this.engine.receiveShadow = true;
    this.mesh.add(this.engine);

    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTaiPlane = new THREE.MeshPhongMaterial({
        color: color.red,
        shading: THREE.FlatShading,
    });
    this.tailPlane = new THREE.Mesh(geomTailPlane, matTaiPlane);
    this.tailPlane.castShadow = true;
    this.tailPlane.receiveShadow = true;
    this.tailPlane.position.set(-35, 25, 0);
    this.mesh.add(this.tailPlane);

    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({
        color: color.red,
        shading: THREE.FlatShading,
    });
    this.sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    this.sideWing.castShadow = true;
    this.sideWing.receiveShadow = true;
    this.mesh.add(this.sideWing);

    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({
        color: color.brown,
        shading: THREE.FlatShading,
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({
        color: color.brownDark,
        shading: THREE.FlatShading,
    });
    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10,27,0);
    this.mesh.add(this.pilot.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
};

var airplane;
var createPlane = function () {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = game.planeDefaultHeight;
    scene.add(airplane.mesh);
};

var Ennemy = function () {
    var geom = new THREE.TetrahedronGeometry(8,2);
    var mat = new THREE.MeshPhongMaterial({
        color: color.red,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
};


var EnnemiesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.ennemiesInUse = [];
};

EnnemiesHolder.prototype.rotateEnnemies = function () {
    for(var i=0; i<this.ennemiesInUse.length; i++){
        var ennemy = this.ennemiesInUse[i];

        ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;
        if(ennemy.angle > 2*Math.PI) ennemy.angle -= 2*Math.PI;

        ennemy.mesh.position.y = -game.seaRadius + ennemy.distance*Math.sin(ennemy.angle);
        ennemy.mesh.position.x = ennemy.distance*Math.cos(ennemy.angle);
        ennemy.mesh.rotation.z += Math.random()*.1;
        ennemy.mesh.rotation.y += Math.random()*.1;

        var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
        var d = diffPos.length();
        if(d<game.ennemyDistanceTolerance){
            particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, color.red, 3);

            ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
            this.mesh.remove(ennemy.mesh);

            game.planeCollisionSpeedX = 100 * diffPos.x / d;
            game.planeCollisionSpeedY = 100 * diffPos.y / d;
            ambientLight.intensity = 2;

            removeEnergy();
            i--;
        }else if(ennemy.angle > Math.PI){
            ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
            this.mesh.remove(ennemy.mesh);
            i--;
        }
    }
};

EnnemiesHolder.prototype.spawnEnnemies = function () {
    var nEnnemies = game.level;

    for(var i=0; i<nEnnemies; i++){
        var ennemy;
        if(ennemiesPool.length){
            ennemy = ennemiesPool.pop();
        }else {
            ennemy = new Ennemy();
        }

        ennemy.distance =  game.seaRadius + game.planeDefaultHeight + (-1 + Math.random()*2) * (game.planeAmpHeight - 20);
        ennemy.angle = -(i*0.1);
        ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*game.distance;
        ennemy.mesh.position.x = Math.cos(ennemy.angle)*game.distance;

        this.mesh.add(ennemy.mesh);
        this.ennemiesInUse.push(ennemy);
    }
};

var createEnnemies = function () {
    for(var i=0; i<10; i++){
        var ennemy = new Ennemy();
        ennemiesPool.push(ennemy);
    }
    ennemiesHolder = new EnnemiesHolder();
    scene.add(ennemiesHolder.mesh);
};

var createPaticles = function () {
    for(var i=0; i<10; i++){
        var paticle = new Particle();
        particlesPool.push(particle);
    }
    particlesHolder = new ParticlesHolder();
    scene.add(particlesHolder.mesh);
};

Particle = function () {
    var geo = new THREE.TetrahedronGeometry(3, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geo, mat);
};

Particle.prototype.explode = function (pos, color, scale) {
    var _this = this;
    var _p = this.mesh.parent;
    var speed = .6 + Math.random()*.2;
    var targetX = pos.x + (-1 + Math.random()*2)*50;
    var targetY = pos.y + (-1 + Math.random()*2)*50;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);

    TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
    TweenMax.to(this.mesh.rotation, speed, {x: Math.random()*12, y: Math.random()*12});
    TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random()*.1,
        ease: Power2.easeOut, onComplete: function () {
            if(_p) _p.remove(_this.mesh);
            _this.mesh.scale.set(1, 1, 1);
            particlesPool.unshift(_this);
        }});
};

ParticlesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
};

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale) {
    for(var i= 0; i<density; i++){
        var particle;
        if(particlesPool.length){
            particle = particlesPool.pop();
        }else{
            particle = new Particle();
        }

        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        particle.mesh.position.x = pos.x;
        particle.mesh.position.y = pos.y;
        particle.explode(pos, color, scale);

    }
};

Coin = function () {
    var geom = new THREE.TetrahedronGeometry(5, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: 0x009999,
        specular: 0xffffff,
        shininess: 0,
        shading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
};

CoinsHolder = function (nCoins) {
    this.mesh = new THREE.Object3D();
    this.coinsPool = [];
    this.coinsInUse = [];
    for(var i=0; i<nCoins; i++){
        var coin = new Coin();
        this.coinsPool.push(coin);
    }
};

CoinsHolder.prototype.spawnCoins = function () {
    var nCoins = 1 + Math.floor(Math.random()*10);

    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random()*2)*game.planeAmpHeight;
    var ampliture = 10 + Math.round(Math.random()*10);
    for(var i=0; i<nCoins; i++){
        var coin;
        if(this.coinsPool.length){
            coin = this.coinsPool.pop();
        }else{
            coin = new Coin();
        }

        this.coinsInUse.push(coin);
        this.mesh.add(coin.mesh);
        coin.distance = d + Math.cos(i*.5)*ampliture;
        coin.angle = -(i*0.02);
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
    }
};

CoinsHolder.prototype.rotateCoins = function () {
    for(var i=0; i<this.coinsInUse.length; i++){
        var coin = this.coinsInUse[i];
        if(coin.exploding)continue;

        coin.angle += game.speed*deltaTime*game.coinsSpeed;
        if(coin.angle>Math.PI*2) coin.angle -= 2*Math.PI;

        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
        coin.mesh.rotation.z += Math.random()*.1;
        coin.mesh.rotation.y += Math.random()*.1;

        var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
        if(diffPos.length() < game.coinDistanceTolerance){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);

            particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
            addEnergy();
            i--;
        }else if(coin.angle > Math.PI){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            i--;
        }
    }
    
};

var createCoins = function () {
    coinsHolder = new CoinsHolder(20);
    scene.add(coinsHolder.mesh);
};

var mousePos = {x:0, y:0};
var handleMouseMove = function (event) {
    var tx = -1 + (event.clientX / width)*2;
    var ty = 1- (event.clientY / height) * 2;
    mousePos = {x:tx, y:ty};
};

var handleTouchMove = function (event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
};

var handleMouseUp = function (event){
    if (game.status == "waitingReplay"){
        resetGame();
        hideReplay();
    }
};

var handleTouchEnd = function (event){
    if (game.status == "waitingReplay"){
        resetGame();
        hideReplay();
    }
};


var updatePlane = function () {
    game.planeSpeed = normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);
    var targetX = normalize(mousePos.x, -1, 1, -game.planeAmpWidth*.7, -game.planeAmpWidth);
    var targetY = normalize(mousePos.y, -.75, .75, game.planeDefaultHeight-game.planeAmpHeight, game.planeDefaultHeight+game.planeAmpHeight);

    game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
    targetY += game.planeCollisionDisplacementY;

    game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
    targetX += game.planeCollisionDisplacementX;

    airplane.mesh.position.y += (targetY - airplane.mesh.position.y)*deltaTime*game.planeMoveSensivity;
    airplane.mesh.position.x += (targetX - airplane.mesh.position.x)*deltaTime*game.planeMoveSensivity;

    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y)*deltaTime*game.planeRotXSensivity;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY)*deltaTime*game.planeRotZSensivity;

    camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
    camera.updateProjectionMatrix();
    camera.position.y += (airplane.mesh.position.y - camera.position.y)*deltaTime*game.cameraSensivity;

    game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime*0.03;
    game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime*0.01;
    game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime*0.03;
    game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime*0.01;

    // airplane.propeller.rotation.x += 0.3;
    airplane.pilot.updateHairs();
};

var normalize = function (v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin)/dv;
    var dt = tmax - tmin;
    var tv = tmin + pc*dt;
    return tv;
};

var Pilot = function(){
    this.mesh = new THREE.Object3D();
    this.mesh.name = "pilot";

    // angleHairs是用于后面头发的动画的属性
    this.angleHairs=0;

    // 飞行员的身体
    var bodyGeom = new THREE.BoxGeometry(15,15,15);
    var bodyMat = new THREE.MeshPhongMaterial({color:color.brown, shading:THREE.FlatShading});
    var body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(2,-12,0);
    this.mesh.add(body);

    // 飞行员的脸部
    var faceGeom = new THREE.BoxGeometry(10,10,10);
    var faceMat = new THREE.MeshLambertMaterial({color:color.pink});
    var face = new THREE.Mesh(faceGeom, faceMat);
    this.mesh.add(face);

    // 飞行员的头发
    var hairGeom = new THREE.BoxGeometry(4,4,4);
    var hairMat = new THREE.MeshLambertMaterial({color:color.brown});
    var hair = new THREE.Mesh(hairGeom, hairMat);
    // 调整头发的形状至底部的边界，这将使它更容易扩展。
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

    // 创建一个头发的容器
    var hairs = new THREE.Object3D();

    // 创建一个头发顶部的容器（这会有动画效果）
    this.hairsTop = new THREE.Object3D();

    // 创建头顶的头发并放置他们在一个3*4的网格中
    for (var i=0; i<12; i++){
        var h = hair.clone();
        var col = i%3;
        var row = Math.floor(i/3);
        var startPosZ = -4;
        var startPosX = -4;
        h.position.set(startPosX + row*4, 0, startPosZ + col*4);
        this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);

    // 创建脸庞的头发
    var hairSideGeom = new THREE.BoxGeometry(12,4,2);
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
    var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
    var hairSideL = hairSideR.clone();
    hairSideR.position.set(8,-2,6);
    hairSideL.position.set(8,-2,-6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    // 创建后脑勺的头发
    var hairBackGeom = new THREE.BoxGeometry(2,8,10);
    var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    hairBack.position.set(-1,-4,0)
    hairs.add(hairBack);
    hairs.position.set(-5,5,0);

    this.mesh.add(hairs);

    var glassGeom = new THREE.BoxGeometry(5,5,5);
    var glassMat = new THREE.MeshLambertMaterial({color:color.brown});
    var glassR = new THREE.Mesh(glassGeom,glassMat);
    glassR.position.set(6,0,3);
    var glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;

    var glassAGeom = new THREE.BoxGeometry(11,1,11);
    var glassA = new THREE.Mesh(glassAGeom, glassMat);
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);

    var earGeom = new THREE.BoxGeometry(2,3,2);
    var earL = new THREE.Mesh(earGeom,faceMat);
    earL.position.set(0,0,-6);
    var earR = earL.clone();
    earR.position.set(0,0,6);
    this.mesh.add(earL);
    this.mesh.add(earR);
}

Pilot.prototype.updateHairs = function () {
    var hairs = this.hairsTop.children;

    var l = hairs.length;
    for(var i=0; i<l; i++){
        var h = hairs[i];
        h.position.y = .75+Math.cos(this.angleHairs+i/3)*.25;
    }
    this.angleHairs += game.speed*deltaTime*40;
};

var createParticles = function () {
    for(var i=0; i<10; i++){
        var particle = new Particle();
        particlesPool.push(particle);
    }

    particlesHolder = new ParticlesHolder();
    scene.add(particlesHolder.mesh);
};

var updateDistance = function () {
    game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
    fieldDistance.innerHTML = Math.floor(game.distance);
    var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
    levelCircle.setAttribute("stroke-dashoffset", d);
};

var updateEnergy = function () {
    game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
    game.energy = Math.max(game.energy, 0);
    energyBar.style.right = (100-game.energy)+"%";
    energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";

    if(game.energy<30){
        energyBar.style.animationName = "blinking";
    }else{
        energyBar.style.animationName = "none";
    }

    if(game.energy<1){
        game.status = "gameover";
    }
};

function addEnergy(){
    game.energy += game.coinValue;
    game.energy = Math.min(game.energy, 100);
}

var removeEnergy = function (){
    game.energy -= game.ennemyValue;
    game.energy = Math.max(0, game.energy);
};

function showReplay(){
    replayMessage.style.display="block";
}

function hideReplay(){
    replayMessage.style.display="none";
}

var loop = function () {
    newTime = new Date().getTime();
    deltaTime = newTime - oldTime;
    oldTime = newTime;

    if(game.status == "playing"){
        if(Math.floor(game.distance%game.distanceForCoinsSpawn) == 0 && Math.floor(game.distance)>game.coinLastSpawn){
            game.coinLastSpawn = Math.floor(game.distance);
            coinsHolder.spawnCoins();
        }

        if(Math.floor(game.distance%game.distanceForEnnemiesSpawn) == 0 && Math.floor(game.distance)>game.ennemyLastSpawn){
            game.ennemyLastSpawn = Math.floor(game.distance);
            ennemiesHolder.spawnEnnemies();
        }

        if(Math.floor(game.distance%game.distanceForSpeedUpdate)==0 && Math.floor(game.distance)> game.speedLastUpdate){
            game.speedLastUpdate = Math.floor(game.distance);
            game.baseSpeed += deltaTime*game.incrementSpeedByTime;
        }

        if(Math.floor(game.distance%game.distanceForLevelUpdate)==0 && Math.floor(game.distance)>game.levelLastUpdate){
            game.levelLastUpdate = Math.floor(game.distance);
            game.level++;
            fieldLevel.innerHTML = Math.floor(game.level);

            game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level;
        }

        updatePlane();
        updateDistance();
        updateEnergy();
        game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed)*deltaTime*0.02;
        game.speed = game.baseSpeed*game.planeSpeed;
    }else if(game.status == "gameover"){
        game.speed *= .99;
        airplane.mesh.rotation.z += (Math.PI/2 - airplane.mesh.rotation.z)*0.0002*deltaTime;
        airplane.mesh.rotation.x += 0.0003*deltaTime;

        game.planeFallSpeed *= 1.05;
        airplane.mesh.position.y -= game.planeFallSpeed*deltaTime;
        if(airplane.mesh.position<-200){
            showReplay();
            game.status = "waitingReplay";
        }
    }else if(game.status == "waitingReplay"){

    }

    airplane.propeller.rotation.x += .5 + game.planeSpeed*deltaTime*.005;
    sea.mesh.rotation.z += game.speed*deltaTime;
    if(sea.mesh.rotation.z > Math.PI*2) sea.mesh.rotation.z -= 2*Math.PI;

    ambientLight.intensity += (.5-ambientLight.intensity)*deltaTime*0.005;

    coinsHolder.rotateCoins();
    ennemiesHolder.rotateEnnemies();
    // sky.mesh.rotation.z += 0.005;
    // sea.mesh.rotation.z += 0.01;
    //
    // updatePlane();
    // airplane.pilot.updateHairs();
    sea.moveWaves();
    sky.moveClouds();

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
};

window.addEventListener('load', init, false);
function init(){
    fieldDistance = document.getElementById("distValue");
    levelCircle = document.getElementById("levelCircleStroke");
    energyBar = document.getElementById("energyBar");
    replayMessage = document.getElementById("replayMessage");
    fieldLevel = document.getElementById("levelValue");

    resetGame();
    createScene();

    createLights();
    createSea();
    createPlane();
    createSky();
    createCoins();
    createEnnemies();
    createParticles();

    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    loop();
}


