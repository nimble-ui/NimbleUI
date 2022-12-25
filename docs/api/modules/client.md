[API Docs - v0.1.0](../README.md) / client

# Module: client

## Table of contents

### Functions

- [mount](client.md#mount)

## Functions

### mount

▸ **mount**(`template`, `root`): `Object`

Mounts the application

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | [`Render`](types.md#render) | the template to render to `root` |
| `root` | `HTMLElement` | the root element to render `template` to |

#### Returns

`Object`

an object to update and shut down the view.

| Name | Type |
| :------ | :------ |
| `unmount` | () => `void` |
| `update` | () => `void` |

#### Defined in

[internal/client/index.ts:11](https://github.com/nimble-ui/NimbleUI/blob/63137c0/src/internal/client/index.ts#L11)
