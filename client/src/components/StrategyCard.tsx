import type {Strategy} from "@shared/types/strategy";

type Props = {
    strategy: Strategy,
};
export default function StrategyCard({strategy}: Readonly<Props>) {

    return (
        <div>
            <h3>Strategy #{strategy.id}</h3>
            <p>{strategy.text}</p>
        </div>
    );
}
