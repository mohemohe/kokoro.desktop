import * as React from "react";
import {style} from "typestyle";
import {OverlayScrollbarsComponent, OverlayScrollbarsComponentProps} from "overlayscrollbars-react";
import {AutoSizer, InfiniteLoader, InfiniteLoaderProps, List} from "react-virtualized";

export interface IProps extends OverlayScrollbarsComponentProps, InfiniteLoaderProps {
	children: any;
	items: React.ReactNode[]
}

export interface IState {
	scrollTop: number;
}

const styles = {
	root: style({
		flex: 1,
		display: "flex",
		$nest: {
			"& > .os-host": {
				flex: 1,
			},
		},
	}),
};

export class VirtualizedOverlayScroller extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			scrollTop: 0,
		};
	}

	public render() {
		return (
			<div className={styles.root}>
				<OverlayScrollbarsComponent options={{
					className: this.props.className || "os-theme-dark",
					scrollbars: (this.props.options || {}).scrollbars || {
						autoHide: "leave",
						autoHideDelay: 300
					},
					callbacks:{
						onScroll: (event) => {
							this.setState({
								scrollTop: (event!.currentTarget! as any).scrollTop,
							});
						}
					},
				}}>
					<AutoSizer>
						{({ height, width }) => (
                            <InfiniteLoader
                                isRowLoaded={this.props.isRowLoaded || ((index) => true)}
                                loadMoreRows={this.props.loadMoreRows || (async ({ startIndex, stopIndex }) => ({}))}
                                rowCount={this.props.items.length}
                            >
								{({ onRowsRendered, registerChild }) => (
									<List
										autoHeight={true}
										height={height}
										onRowsRendered={onRowsRendered}
										ref={registerChild}
										rowCount={this.props.items.length}
										rowHeight={24}
										rowRenderer={({ key, index, style }) =>
											<div key={key} style={style}>
												{this.props.items[index]}
											</div>
										}
										width={width}
										scrollTop={this.state.scrollTop}
									/>
								)}
							</InfiniteLoader>
						)}
					</AutoSizer>
				</OverlayScrollbarsComponent>
			</div>
		);
	}
}
