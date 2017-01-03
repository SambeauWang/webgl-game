### camera
##### 正交投影照相机
`THREE.OrthographicCamera(left, right, top, bottom, near, far)`   
这六个参数分别代表正交投影照相机拍摄到的空间的六个面的位置，这六个面围成一个长方体，我们称其为视景体（Frustum）。只有在视景体内部（下图中的灰色部分）的物体才可能显示在屏幕上，而视景体外的物体会在显示之前被裁减掉。near与far都是指到照相机位置在深度平面的位置，而照相机不应该拍摄到其后方的物体，因此这两个值应该均为正值。   
Ps:  
  为了保持照相机的横竖比例，需要保证(right - left)与(top - bottom)的比例与Canvas宽度与高度的比例一致。
```
var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
camera.position.set(0, 0, 5);
scene.add(camera);

var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
);
scene.add(cube);
```

##### 透视投影照相机
![Perspective](img/perspective.big)
fov是视景体竖直方向上的张角（是角度制而非弧度制），如侧视图所示。aspect等于width/height，是照相机水平方向和竖直方向长度的比值，通常设为Canvas的横纵比。near和far分别是照相机到视景体最近、最远的距离，均为正值，且far应大于near。

### 几何形状
##### 立方体
`THREE.CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)`      
width是x方向上的长度；height是y方向上的长度；depth是z方向上的长度；后三个参数分别是在三个方向上的分段数，如widthSegments为3的话，代表x方向上水平分为三份。一般情况下不需要分段的话，可以不设置后三个参数，后三个参数的缺省值为1。

##### 平面
`THREE.PlaneGeometry(width, height, widthSegments, heightSegments)`   
其中，width是x方向上的长度；height是y方向上的长度；后两个参数同样表示分段。

##### 球体
`THREE.SphereGeometry(radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength)`   
其中，radius是半径；segmentsWidth表示经度上的切片数；segmentsHeight表示纬度上的切片数；phiStart表示经度开始的弧度；phiLength表示经度跨过的弧度；thetaStart表示纬度开始的弧度；thetaLength表示纬度跨过的弧度。

##### 圆形
`THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)`   
这四个参数都是球体中介绍过的，这里不再赘述，直接来看个例子。new THREE.CircleGeometry(3, 18, Math.PI / 3, Math.PI / 3 * 4)可以创建一个在x轴和y轴所在平面的三分之二圆的扇形：

##### 圆柱体
`THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)`   
其中，radiusTop与radiusBottom分别是顶面和底面的半径，由此可知，当这两个参数设置为不同的值时，实际上创建的是一个圆台；height是圆柱体的高度；radiusSegments与heightSegments可类比球体中的分段；openEnded是一个布尔值，表示是否没有顶面和底面，缺省值为false，表示有顶面和底面。

##### 正四面体、正八面体、正二十面体
正四面体（TetrahedronGeometry）、正八面体（OctahedronGeometry）、正二十面体（IcosahedronGeometry）的构造函数较为类似，分别为：
``` javascript
THREE.TetrahedronGeometry(radius, detail)
THREE.OctahedronGeometry(radius, detail)
THREE.IcosahedronGeometry(radius, detail)
```

##### 圆环面
圆环面（TorusGeometry）就是甜甜圈的形状，其构造函数是：   
`THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)`   
其中，radius是圆环半径；tube是管道半径；radialSegments与tubularSegments分别是两个分段数，详见上图；arc是圆环面的弧度，缺省值为Math.PI * 2。

##### 圆环面
`THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)`   
其中，radius是圆环半径；tube是管道半径；radialSegments与tubularSegments分别是两个分段数，详见上图；arc是圆环面的弧度，缺省值为Math.PI * 2

##### 圆环结
如果说圆环面是甜甜圈，那么圆环结（TorusKnotGeometry）就是打了结的甜甜圈，其构造参数为：`THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q, heightScale)`


### 文字形状
文字形状（TextGeometry）可以用来创建三维的文字形状。我们在Three.js GitHub master/examples/fonts目录下，下载helvetiker_regular.typeface.json文件放在你的目录下，然后用以下方法加载：
``` javascript
var loader = new THREE.FontLoader();
loader.load('../lib/helvetiker_regular.typeface.json', function(font) {
    var mesh = new THREE.Mesh(new THREE.TextGeometry('Hello', {
        font: font,
        size: 1,
        height: 1
    }), material);
    scene.add(mesh);

    // render
    renderer.render(scene, camera);
});
```
其中，text是文字字符串，parameters是以下参数组成的对象：

size：字号大小，一般为大写字母的高度
height：文字的厚度
curveSegments：弧线分段数，使得文字的曲线更加光滑
font：字体，默认是'helvetiker'，需对应引用的字体文件
weight：值为'normal'或'bold'，表示是否加粗
style：值为'normal'或'italics'，表示是否斜体
bevelEnabled：布尔值，是否使用倒角，意为在边缘处斜切
bevelThickness：倒角厚度
bevelSize：倒角宽度

##### 自定义形状
自定义形状使用的是Geometry类，它是其他如CubeGeometry、SphereGeometry等几何形状的父类，其构造函数是：
``` javascript
// 初始化几何形状
var geometry = new THREE.Geometry();

// 设置顶点位置
// 顶部4顶点
geometry.vertices.push(new THREE.Vector3(-1, 2, -1));
geometry.vertices.push(new THREE.Vector3(1, 2, -1));
geometry.vertices.push(new THREE.Vector3(1, 2, 1));
geometry.vertices.push(new THREE.Vector3(-1, 2, 1));
// 底部4顶点
geometry.vertices.push(new THREE.Vector3(-2, 0, -2));
geometry.vertices.push(new THREE.Vector3(2, 0, -2));
geometry.vertices.push(new THREE.Vector3(2, 0, 2));
geometry.vertices.push(new THREE.Vector3(-2, 0, 2));

// 设置顶点连接情况
// 顶面
geometry.faces.push(new THREE.Face3(0, 1, 3));
geometry.faces.push(new THREE.Face3(1, 2, 3));
// 底面
geometry.faces.push(new THREE.Face3(4, 5, 6));
geometry.faces.push(new THREE.Face3(5, 6, 7));
// 四个侧面
geometry.faces.push(new THREE.Face3(1, 5, 6));
geometry.faces.push(new THREE.Face3(6, 2, 1));
geometry.faces.push(new THREE.Face3(2, 6, 7));
geometry.faces.push(new THREE.Face3(7, 3, 2));
geometry.faces.push(new THREE.Face3(3, 7, 0));
geometry.faces.push(new THREE.Face3(7, 4, 0));
geometry.faces.push(new THREE.Face3(0, 4, 5));
geometry.faces.push(new THREE.Face3(0, 5, 1));
```

### 材质
材质（Material）是独立于物体顶点信息之外的与渲染效果相关的属性。通过设置材质可以改变物体的颜色、纹理贴图、光照模式等

##### 基本材质
使用基本材质（BasicMaterial）的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。如果没有指定材质的颜色，则颜色是随机的。
``` javascript
HREE.MeshBasicMaterial(opt)

visible：是否可见，默认为true
side：渲染面片正面或是反面，默认为正面THREE.FrontSide，可设置为反面THREE.BackSide，或双面THREE.DoubleSide
wireframe：是否渲染线而非面，默认为false
color：十六进制RGB颜色，如红色表示为0xff0000
map：使用纹理贴图
```

##### Lambert材质
Lambert材质是符合Lambert光照模型的材质。Lambert光照模型的主要特点是只考虑漫反射而不考虑镜面反射的效果对于其他大部分物体的漫反射效果都是适用的
```
Idiffuse = Kd * Id * cos(theta)
```
其中，Idiffuse是漫反射光强，Kd是物体表面的漫反射属性，Id是光强，theta是光的入射角弧度
```
new THREE.MeshLambertMaterial({
    color: 0xffff00,
    emissive: 0xff0000
})
```
color是用来表现材质对散射光的反射能力，也是最常用来设置材质颜色的属性   
emissive是材质的自发光颜色，可以用来表现光源的颜色

##### Phong材质
Phong材质是符合Phong光照模型的材质。和Lambert不同的是，Phong模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合
```
Ispecular = Ks * Is * (cos(alpha)) ^ n
```
其中，`Ispecular`是镜面反射的光强，`Ks`是材质表面镜面反射系数，`Is`是光源强度，`alpha`是反射光与视线的夹角，`n`是高光指数，越大则高光光斑越小。
```
var material = new THREE.MeshPhongMaterial({
    specular: 0xff0000
});
var sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 8), material);
```
`specular`值指定镜面反射系数作说明,可以通过`shininess`属性控制光照模型中的n值，当`shininess`值越大时，高光的光斑越小，默认值为30。

##### 法向材质
法向材质可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助。
``` javascript
new THREE.MeshNormalMaterial();
```
材质的颜色与照相机与该物体的角度相关，下面我们只改变照相机位置，观察两个角度的颜色变化.我们观察的是同样的三个面，但是由于观察的角度不同，物体的颜色就不同了。因此，在调试时，要知道物体的法向量，使用法向材质就很有效。

##### 材质的纹理贴图


### 光与影
##### 环境光
环境光是指场景整体的光照效果，是由于场景内若干光源的多次反射形成的亮度一致的效果，通常用来为整个场景指定一个基础亮度。因此，环境光没有明确的光源位置，在各处形成的亮度也是一致的
``` javascript
THREE.AmbientLight(hex)
// 其中，hex是十六进制的RGB颜色信息，如红色表示为0xff0000。
```
将环境光设置为红色，场景内同样放置绿色和白色的长方体，渲染的结果是这两个长方体都被渲染成了环境光的红色，这一结果可能有些出乎你的意料。其实，环境光并不在乎物体材质的color属性，而是ambient属性(r71之后被移除)

##### 点光源
点光源是不计光源大小，可以看作一个点发出的光源。点光源照到不同物体表面的亮度是线性递减的，因此，离点光源距离越远的物体会显得越暗
``` javascript
THREE.PointLight(hex, intensity, distance)

var light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 1.5, 2);
scene.add(light);
```
其中，hex是光源十六进制的颜色值；intensity是亮度，缺省值为1，表示100%亮度；distance是光源最远照射到的距离，缺省值为0。