'use client'

import {
    BoldItalicUnderlineToggles,
    headingsPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    quotePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo
} from "@mdxeditor/editor"
import {FC} from 'react'
import PlatinumRichTextEditorStyles from "./PlatinumRichTextEditor.module.scss";

interface EditorProps {
    markdown: string
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({markdown, editorRef}) => {
    return <div className={PlatinumRichTextEditorStyles.platinumRichTextEditor}>
        <MDXEditor ref={editorRef} markdown={markdown} contentEditableClassName="prose"
                   plugins={[headingsPlugin(), headingsPlugin(),
                       listsPlugin(),
                       quotePlugin(),
                       thematicBreakPlugin(),
                       markdownShortcutPlugin(), toolbarPlugin({
                           toolbarContents: () => (
                               <>
                                   {' '}
                                   <UndoRedo/>
                                   <BoldItalicUnderlineToggles/>
                               </>
                           )
                       })
                   ]}/></div>
}

export default Editor
