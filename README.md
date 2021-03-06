# npm install

# npm run storybook

### npm install -g create-react-app

### create-react-app  yourProjectName --template typescript

### 进到 yourProjectName 执行 npx -p @storybook/cli sb init --type react_scripts

### actions插件

actions插件有点像jest的fn一样，用来在触发事件时显示在action面板上，避免人为打开控制台查看输出了啥。

actions插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/actions

- npm i -D @storybook/addon-actions

```
module.exports = {
  addons: ['@storybook/addon-actions'],
};
```

### links插件

links插件用来在各个故事书中进行跳转，相当于a标签一样，是个很常用的插件。

links插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/links

- yarn add -D @storybook/addon-links

```
module.exports = {
  addons: ['@storybook/addon-links']
}
```

### viewport插件

viewport插件，用来自由调整视口大小。

插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/viewport

- npm i -D @storybook/addon-viewport

```
module.exports = {
  addons: ['@storybook/addon-viewport'],
};
```

### knob插件

knob插件，用来调整输入范例。

插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/knobs

- yarn add @storybook/addon-knobs --dev

```
module.exports = {
  addons: ['@storybook/addon-knobs'],
};
```


### docs插件

docs插件，用来制作文档。

插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/docs

- yarn add -D @storybook/addon-docs

Docs has peer dependencies on react, react-is, and babel-loader. If you want to write stories in MDX, you may need to add these dependencies as well:

- yarn add -D react react-is babel-loader

```
module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx)'],
  addons: ['@storybook/addon-docs'],
};
```


### a11y插件

a11y插件，用来自动检测组件是否支持视障人士等规范的。

插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/a11y

- yarn add @storybook/addon-a11y --dev

```
module.exports = {
  addons: ['@storybook/addon-a11y'],
};
```

### source插件

source插件，故事书上的源码映射。

插件文档地址https://github.com/storybookjs/storybook/tree/master/addons/storysource

- yarn add @storybook/addon-storysource --dev

```
module.exports = {
  addons: ['@storybook/addon-storysource'],
};
```

### 定制型组件库推荐使用styled components这种css in js的实现方式

npm install  styled-components @types/styled-components -D


### npm i @storybook/addon-ally @storybook/addon-knobs @storybook/addon-storysource -D
