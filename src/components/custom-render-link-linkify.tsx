// @ts-ignore
const renderLink = ({attributes, content}) => {
    const {href, ...props} = attributes;
    return <a
        target={"_blank"}
        rel={"noopener noreferrer"}
        className={"text-blue-500 hover:underline"}
        onClick={(e) => {
            e.stopPropagation()
            window.app.openExternal(href, false)
        }}
        {...props}>
        {content}
    </a>
}

renderLink.displayName = "renderLink"
export default renderLink