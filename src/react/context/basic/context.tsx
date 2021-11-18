import React, { ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { useForceRender } from '../../hooks/useForceRender';

interface Value {
    one: number;
    two: number;
    three: number;
}

const DemonstratorContext = React.createContext<Value>({ one: -1, two: -1, three: -1 });

class Counter {
    private _count = 0;

    count() {
        return this._count;
    }

    asString() {
        return `${this.count()}`;
    }

    increment() {
        this._count += 1;
    }
}

const useRenderCounter = () => {
    const counter = useRef(new Counter());
    const increment = useCallback(() => counter.current.increment(), []);
    return { increment, counter: counter.current.asString() };
};

type ComponentWithRenderCounterProps = {
    name: string
    description: string
    children?: ReactNode | undefined
}


const ComponentWithRenderCounter = (props: ComponentWithRenderCounterProps) => {
    const { counter, increment } = useRenderCounter();
    increment();
    return (
        <>
            <dl>
                <dt>name</dt>
                <dd>{props.name}</dd>
                <dt>description</dt>
                <dd>{props.description}</dd>
                <dt>remder#</dt>
                <dd>{counter}</dd>
            </dl>
            {props.children}
        </>);
};


const MemoComponentWithRenderCounter = React.memo(ComponentWithRenderCounter);

interface ContainerProps {
    content: string;
}

const Container = (props: ContainerProps) => {
    return (
        <div>
            <text>I'm the Container</text>
            <DateTime content={props.content}/>
        </div>
    );
};

const MemoContainer = React.memo(Container);


const AccessOneFromContext = () => {
    const value = useContext(DemonstratorContext);
    const { counter, increment } = useRenderCounter();
    increment();
    return (
        <>
            <div>value.one: {value.one}</div>
            <div>#: {counter}</div>
        </>
    );
};

const dateTime = () => {
    return new Date().toISOString();
};

interface DateTimeProps {
    content: string;
}

const DateTime = (props: DateTimeProps) => {
    const { counter, increment } = useRenderCounter();
    increment();
    return <span>{props.content + ' #' + counter}</span>;
};

const MemoDateTime = React.memo(DateTime);


export const ContextRoot = () => {
    const [independent, setIndependent] = useState(dateTime);
    const { counter, increment } = useRenderCounter();
    const forceRender = useForceRender();
    const [value, setValue] = useState({ one: 1, two: 2, three: 3 });
    increment();
    return (
        <DemonstratorContext.Provider value={value}>
            <text>
                {JSON.stringify(value)}
            </text>
            <button onClick={forceRender}>Force Render</button>
            <button onClick={() => {
                setValue((cur) => ({ ...cur, one: cur.one + 1 }));
            }}>increment value.one
            </button>
            <button onClick={() => {
                setValue(cur => ({ ...cur }));
            }}>replace value in context with de-structure
            </button>
            <button onClick={() => {
                setIndependent(dateTime());
            }}>Refresh Date Time
            </button>
            <div>Render Counter: {counter}</div>
            <ComponentWithRenderCounter name="vanilla" description="Not using anything from the contexst"/>
            <MemoComponentWithRenderCounter name="vanilla memo" description="Not using anything from the contexst and is memoized">
                <MemoDateTime content={independent}/>
            </MemoComponentWithRenderCounter>
            <MemoContainer content={independent}/>
            <AccessOneFromContext/>
        </DemonstratorContext.Provider>
    );
};
