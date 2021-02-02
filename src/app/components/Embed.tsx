import * as React from "react";
import {style} from "typestyle";
import Linkify from "react-linkify";
import {IEmbedContentEntity} from "kokoro-io/src/lib/IPuripara";

export interface IProps {
	content: IEmbedContentEntity;
}

const styles = {
	root: style({
		display: "flex",
		borderLeft: "4px solid #dddddd",
		marginTop: "0.5em",
		paddingLeft: "0.5em",
	}),
	icon: style({
		maxWidth: 180,
		paddingRight: "0.5em",
	}),
	mediaContainer: style({
		overflow: "hidden",
	}),
	image: style({
		maxWidth: "25%",
		maxHeight: 320,
	}),
	nsfw: style({
		filter: "blur(8px) grayscale(75%)",
		transition: "all 0.3s linear",
		overflow: "hidden",
		$nest: {
			"&:hover": {
				filter: "none",
			},
		},
	}),
};

export class Embed extends React.Component<IProps, {}> {
	public render() {
		const {data} = this.props.content;
		if (!data) {
			return <div/>
		}
		return (
			<div className={styles.root}>
				{data.metadata_image && data.metadata_image.thumbnail.url ?
					<div>
						<img src={data.metadata_image.thumbnail.url} alt={data.title} className={styles.icon}/>
					</div> :
					<></>
				}
				<div>
					<div>
						{data.title}
					</div>
					<div>
						<Linkify componentDecorator={(href, text, key) => <a href={href} key={key} target="_blank">{text}</a>}>
							{data.description}
						</Linkify>
					</div>
					{data.medias && data.medias.length > 0 ?
						<div className={styles.mediaContainer}>
							{data.medias.map((media, index) => {
								if (!media.thumbnail) {
									return;
								}
								const classNames = [styles.image];
								if (media.restriction_policy !== "Safe") {
									classNames.push(styles.nsfw);
								}
								return (
									<span className={styles.mediaContainer} key={index} >
										<img
											className={classNames.join(" ")}
											src={media.thumbnail.url}
											width={media.thumbnail.width}
											height={media.thumbnail.height}
										/>
									</span>
								);
							})}
						</div> :
						<></>
					}
				</div>
			</div>
		)
	}
}
