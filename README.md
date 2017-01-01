# 手势密码
## 基于canvas开发的手势密码插件
【示例图片1】

![深色截图](/images/dark.png)
## 功能特点
1. 适配各种尺寸的屏幕
2. 灵活的样式配置
3. 没有其他依赖

## useage
```html
<div id="password"></div>
<script src="yourPath/gesture.password.js"></script>
<script type="text/javascript">
    var gp = new GesturePassword('password');
</script>
```
上面代码的显示效果是一个默认样式的手势密码（如上面的示例图片1）。当然，样式可以配置，以便更符合自己的页面的风格。
下面的配置，上面浅色的截图。
示例：
```javascript
var gp = new GesturePassword('password',{
    circle: {
        sizeScale: 0.9,
        default: {
            strokeStyle: '#D5DBE8'
        }
    },
    line: {
        lineWidth: 3,
        default: {
            strokeStyle: '#50A2E9'
        }
    },
    dot: {
        size: 8,
        default: {
            fillStyle: '#50A2E9'
        }
    }
    }
});
```
上面的代码出现的效果：

![浅色截图](/images/light.png)
```javascript
/*
* @param id:一个字符串或者dom对象，手势密码的挂载点
* @param config:一个对象，下面会详细介绍
*/
function GesturePassword(id,config){
//...
}
```
id:一个字符转或dom对象，字符串将直接出入`getElementById`中
config:
```javascript
{
    circle:{}//可以在这里配置外层空心圆圈的颜色，线的宽度和圆圈大小
    line:{}//可以在这里配置手势滑动时候连线的相关属性，比如颜色，线的粗细
    dot:{}//这里配置中间的实心圆点的相关属性，颜色，圆点大小
}
```
config中的`circle`对应空心圆，`line`对应手指滑动时候那条线，`dot`对应园中心那个实心点。
`GesturePassword`内部共有三个状态：`default`，`right`，`wrong`，上面的示例只配置了`default`状态下的样式。顾名思义，`right`是配置当状态切换成right时的样式，`wrong`是配置当状态切换成wrong时候的样式。
#### 密码
密码从上到下，从左到右依次是数字1-9。如上面的【示例图片1】对应的密码是：`12357`。
#### 方法
``` setRight:切换插件的状态为right ```。如下图：
![right效果](/images/right.png)

``` setWrong:切换插件的状态为wrong ```。如下图：
![wrong效果](/images/wrong.png)

``` reset:重置，需要多次输入密码时使用，例如确认密码。 ```
```javascript
gp.setWrong();//切换状态为wrong
//gp.setRight();//切换状态为right
```

#### 事件
```javascript
complete事件：当用户一次滑动完成时触发。用户输入的图形密码会作为事件执行函数的第一个参数出入。
```
