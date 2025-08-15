export default function Tooltip({ text }: { text: string }) {
    return (
        <span
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
               px-3 py-1 text-sm text-white bg-gray-800 rounded opacity-0
               group-hover:opacity-100 transition-opacity"
        >
            {text}
        </span>
    );
}
