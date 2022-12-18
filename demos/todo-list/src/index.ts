import { e, t, _, c, f, attr, on, each, when } from '../../../src/index'
import mount from '../../../src/client'
import { Component, Middleware } from '../../../src/types'
import { State } from '../../../src/middleware'

type Todos = {id: number, item: string}[]

function TodoList(): Middleware<{}, {
    items(): Todos,
    addTodo(newTodo: string): void,
    removeTodoAt(id: number): () => void
}> {
    return ctx => {
        const todos = ctx.use(State([] as Todos))

        const addTodo = (newTodo: string) => {
            if (newTodo) {
                todos.value = [...todos.value, {
                    id: Math.max(0, ...todos.value.map(t => t.id)) + 1,
                    item: newTodo,
                }]
            }
        }
        const removeTodoAt = (id: number) => () => {
            todos.value = todos.value.filter(t => t.id != id)
        }

        return { items: () => todos.value, addTodo, removeTodoAt }
    }
}

const App: Component<{}> = use => {
    const currentTodo = use(State('')), todos = use(TodoList())
    const addTodo = () => {
        todos.addTodo(currentTodo.value)
        if (currentTodo.value) {
            currentTodo.value = ''
        }
    }
    const onInput = (e: Event) => {
        const i = e.target as HTMLInputElement
        currentTodo.value = i.value
    }
    return f([
        e('h1', [], [t('Todo List')]),
        e('input', [
            attr('type', () => 'text'),
            attr('placeholder', () => 'What to do...'),
            attr('value', () => currentTodo.value),
            on('input', () => onInput)
        ]),
        e('button', [on('click', () => addTodo)], [t('+')]),
        when(() => todos.items().length, each({
            items: todos.items,
            trackBy: () => item => item.id,
        }, item => e('p', [], [
            e('button', [on('click', () => todos.removeTodoAt(item().id))], [t('Done')]),
            t(' '),
            _(() => item().item),
        ])), e('p', [], [t('Nothing to do yet!')])),
    ])
}

window.addEventListener('load', function () {
    mount(c(App, () => ({})), this.document.body)
})