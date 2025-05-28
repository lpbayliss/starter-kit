import { Meter, Label } from "react-aria-components";

const StorageSpace = () => (
	<Meter value={25}>
		{({ percentage, valueText }) => (
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<Label>Storage space</Label>
					<span className="value">{valueText}</span>
				</div>
				<div className="h-2.5 rounded-md overflow-hidden shadow-[0px_0px_0px_1px_var(--color-gray-300)]">
					<div
						className="bg-green-500 h-full"
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		)}
	</Meter>
);

export default StorageSpace;
