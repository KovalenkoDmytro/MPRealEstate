export type BadgeProps = {
    version: 'primary' | 'notification' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
    text: string;

};
export default function Badge({
                                  version = 'primary',
                                  text,
                              }: BadgeProps) {

    const classes = `badge badge-${version}`;

    return (
        <div className={classes}>
            {text}
        </div>
    )

}

