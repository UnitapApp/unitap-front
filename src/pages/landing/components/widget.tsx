import React, { PropsWithChildren } from 'react';
import UButton from '../../../components/basic/Button/UButton';

export interface WidgetPropsInterface extends React.HTMLAttributes<HTMLElement> {
	className?: string;
	description?: string;
	title?: string;
	buttonTitle?: string;
	buttonClass?: string;
	titleClass?: string;
	icon?: string;
	iconSize?: string;
	buttonClassName?: string;
	unClickable?: boolean;

	onButtonClick?(): void;
}

export type WidgetProps = PropsWithChildren<WidgetPropsInterface>;

const Widget = (props: WidgetProps) => {
	const {
		className,
		buttonClassName,
		children,
		description,
		title,
		icon,
		buttonTitle,
		buttonClass,
		titleClass,
		iconSize,
		onButtonClick,
		unClickable,
	} = props;
	return (
		<div className={`${className ? className : ''} flex flex-col justify-between uni-card px-4 pt-4 pb-3`}>
			<section>
				<header className={`flex gap-4 justify-between h-10`}>
					<div className={`${titleClass ? titleClass : ''} flex gap-3 flex-auto`}>
						<p className={'text-white text-xl font-semibold'}>{title}</p>
						{icon && (
							<img
								className={`${iconSize ? iconSize : ''} widget-icon`}
								src={`/assets/images/landing/${icon}`}
								alt={'widget'}
							/>
						)}
					</div>
					{buttonTitle && (
						<div>
							<UButton
								unClickable={unClickable}
								className={`${buttonClass ? buttonClass : 'gradient-outline-button'} `}
								size={'btn-small'}
								onClick={onButtonClick}
								buttonClassName={buttonClassName}
							>
								{buttonTitle}
							</UButton>
						</div>
					)}
				</header>
				{description && <p className={'text-text-secondary text-xs leading-loose font-normal py-4'}>{description}</p>}
			</section>
			<main className={'relative z-10'}>{children}</main>
		</div>
	);
};

export default Widget;
