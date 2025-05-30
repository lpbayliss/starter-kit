import classNames from "classnames";

type ImageLinkCardProps = {
	href: string;
	imageUrl: string;
	title: string;
	subtitle?: string;
	imageAlt?: string;
	className?: string;
	target?: "_blank" | "_self";
	width?: number;
	height?: number;
};

const ImageLinkCard = ({
	href,
	imageUrl,
	title,
	subtitle,
	imageAlt,
	className,
	target = "_self",
	width = 300,
	height = 200,
}: ImageLinkCardProps) => {
	return (
		<a
			href={href}
			target={target}
			rel={target === "_blank" ? "noopener noreferrer" : undefined}
			className={classNames(
				"relative block overflow-hidden rounded-lg group transition-transform duration-200 hover:scale-105 shadow-md hover:shadow-lg",
				className,
			)}
			style={{ width, height }}
		>
			<img
				src={imageUrl}
				alt={imageAlt || title}
				className="w-full h-full object-cover"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
			<div className="absolute bottom-4 right-4 text-white">
				<h3 className="text-lg font-semibold leading-tight mb-1 drop-shadow-lg">
					{title}
				</h3>
				{subtitle && (
					<p className="text-sm opacity-90 drop-shadow-md">{subtitle}</p>
				)}
			</div>
		</a>
	);
};

export default ImageLinkCard;
