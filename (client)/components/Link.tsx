import type React from "react";
import { usePageContext } from "vike-react/usePageContext";

interface LocalizedLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	children: React.ReactNode;
}

export function Link({
	href,
	children,
	className,
	...props
}: LocalizedLinkProps) {
	const pageContext = usePageContext();
	const { urlPathname } = pageContext;
	const isActive =
		href === "/" ? urlPathname === href : urlPathname.startsWith(href);

	// No locale-specific logic needed - cookie persists preference automatically
	return (
		<a
			href={href}
			className={isActive ? `is-active ${className || ""}`.trim() : className}
			{...props}
		>
			{children}
		</a>
	);
}
