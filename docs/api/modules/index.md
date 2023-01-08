[API Docs - v0.2.1-nightly.1](../README.md) / index

# Module: index

## Table of contents

### Functions

- [\_](index.md#_)
- [attr](index.md#attr)
- [block](index.md#block)
- [c](index.md#c)
- [directive](index.md#directive)
- [e](index.md#e)
- [each](index.md#each)
- [f](index.md#f)
- [on](index.md#on)
- [t](index.md#t)
- [when](index.md#when)

## Functions

### \_

▸ **_**(`text`): [`Render`](types.md#render)

Renders a dynamic text node to the document.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | [`Accessor`](types.md#accessor)<`any`\> | An accessor that contains a value for the DOM to display |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:15](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L15)

___

### attr

▸ **attr**(`name`, `value`): [`Attrs`](types.md#attrs)

Adds an attribute to the consuming element

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the attribute |
| `value` | [`Accessor`](types.md#accessor)<`any`\> | an accessor containing the attribute's value |

#### Returns

[`Attrs`](types.md#attrs)

#### Defined in

[internal/core/index.ts:34](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L34)

___

### block

▸ **block**<`Context`\>(`id`, `template`, `context`): [`Block`](types.md#block)

Adds a block to a `directive`'s blocks array

#### Type parameters

| Name |
| :------ |
| `Context` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the block's id used to track the block |
| `template` | (`context`: [`Accessor`](types.md#accessor)<`Context`\>) => [`Render`](types.md#render) | a factory function to render when the block is created or updated |
| `context` | `Context` | a context that a block uses in the `template` |

#### Returns

[`Block`](types.md#block)

#### Defined in

[internal/core/index.ts:84](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L84)

___

### c

▸ **c**<`Props`\>(`comp`, `props`): [`Render`](types.md#render)

Renders a component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comp` | [`Component`](types.md#component)<`Props`\> | the component to instantiate |
| `props` | [`Accessor`](types.md#accessor)<`Props`\> | an accessor containing the component's props |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:52](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L52)

___

### directive

▸ **directive**(`blocks`): [`Render`](types.md#render)

Allows for conditional and list rendering with a Virtual DOM-like approach.
This allows control flow customizability and cross-platform compatability, meaning the consuming API can be rendered in CSR, SSR, and SSG environments.

**`See`**

 - when and
 - each for examples.
 - block for details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocks` | [`Accessor`](types.md#accessor)<[`Block`](types.md#block)[]\> | A factory function that returns an array of blocks to be rendered to the DOM; |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:74](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L74)

___

### e

▸ **e**(`el`, `attrs?`, `children?`): [`Render`](types.md#render)

Renders an HTML element to the document.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `el` | `string` | `undefined` | the type of element to render |
| `attrs` | [`Attrs`](types.md#attrs)[] | `[]` | the element's attributes and event listeners |
| `children` | [`Render`](types.md#render)[] | `[]` | the element's child text and elements |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:25](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L25)

___

### each

▸ **each**<`TItem`\>(`«destructured»`, `renderItems`, `alt?`): [`Render`](types.md#render)

Renders a list of items to the document.

#### Type parameters

| Name |
| :------ |
| `TItem` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | - |
| › `items` | [`Accessor`](types.md#accessor)<`TItem`[]\> | - |
| › `trackBy?` | [`Accessor`](types.md#accessor)<(`item`: `TItem`, `index`: `number`, `array`: `TItem`[]) => `any`\> | - |
| `renderItems` | (`item`: [`Accessor`](types.md#accessor)<`TItem`\>, `index`: [`Accessor`](types.md#accessor)<`number`\>, `array`: [`Accessor`](types.md#accessor)<`TItem`[]\>) => [`Render`](types.md#render) | a function that returns a render instruction for each item |
| `alt` | [`Render`](types.md#render) | a render instruction to render when the `items` array is empty |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:107](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L107)

___

### f

▸ **f**(`children?`): [`Render`](types.md#render)

Renders a fragment, or a group of child nodes, to the document.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `children` | [`Render`](types.md#render)[] | `[]` |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:63](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L63)

___

### on

▸ **on**(`name`, `value`): [`Attrs`](types.md#attrs)

Adds an event listener to the consuming element

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the type of event for the event listener to listen for |
| `value` | [`Accessor`](types.md#accessor)<`undefined` \| ``null`` \| `void` \| <E\>(`e`: `E`) => `void`\> | an accessor containing the callback to call when the event fires |

#### Returns

[`Attrs`](types.md#attrs)

#### Defined in

[internal/core/index.ts:43](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L43)

___

### t

▸ **t**(`text`): [`Render`](types.md#render)

Renders a static text node to the document.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | a value for the DOM to display |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:7](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L7)

___

### when

▸ **when**(`cond`, `then`, `alt?`): [`Render`](types.md#render)

Conditionally renders content

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cond` | [`Accessor`](types.md#accessor)<`any`\> | an accessor containing the condition to test |
| `then` | [`Render`](types.md#render) | child nodes to render if the condition is truthy |
| `alt` | [`Render`](types.md#render) | child nodes to render if the condition is falsey |

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:94](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/core/index.ts#L94)
