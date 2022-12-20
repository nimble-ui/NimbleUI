[API Docs - v0.0.28](../README.md) / index

# Module: index

## Table of contents

### Functions

- [\_](index.md#_)
- [attr](index.md#attr)
- [c](index.md#c)
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

[internal/core/index.ts:15](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L15)

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

[internal/core/index.ts:34](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L34)

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

[internal/core/index.ts:52](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L52)

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

[internal/core/index.ts:25](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L25)

___

### each

▸ **each**<`TItem`\>(`«destructured»`, `renderItems`): [`Render`](types.md#render)

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

#### Returns

[`Render`](types.md#render)

#### Defined in

[internal/core/index.ts:82](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L82)

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

[internal/core/index.ts:63](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L63)

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

[internal/core/index.ts:43](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L43)

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

[internal/core/index.ts:7](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L7)

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

[internal/core/index.ts:73](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/index.ts#L73)
