import { RawMessage } from './chat-provider';

export type Message = {
    raw: RawMessage,
    derived: number;
}

export interface ChatViewProps {
    messages: Message[];
}

export const ChatView = (props: ChatViewProps) => {
    return (
        <div>
            <h1>Chat View</h1>
            <ol>
                {props.messages.map((message, index) => {
                    const text = message.raw.text + ' (' + message.derived + ') ';
                    return <li key={index}>{message.raw.from + ' -> ' + message.raw.to + ': ' + text}</li>;
                })}
            </ol>
        </div>

    );
};
