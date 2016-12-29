# 手势密码
## 基于canvas开发的手势密码插件
![深色截图](/images/dark.png)
  ![浅色截图](/images/light.png)
## 功能特点
1. 适配各种尺寸的屏幕
2. 灵活的样式配置
3. 没有其他依赖

## useage
#### 引用

```html
<div id="password"></div>
<script src="yourPath/gesture.password.js"></script>
<script type="text/javascript">
    var gp = new GesturePassword('password');
</script>
```
上面代码的显示效果是一个默认样式的手势密码。当然，样式可以配置，以便更符合自己的页面的风格。
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
