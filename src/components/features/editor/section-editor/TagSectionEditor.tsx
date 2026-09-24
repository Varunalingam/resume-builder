import type { Section, TagEntry } from '../../../../types/resume.types.ts'
import TagItemEditor from '../item-editor/TagItemEditor.tsx'

interface TagSectionEditorProps {
  section: Section
}

const TagSectionEditor = ({ section }: TagSectionEditorProps) => {
  return (
    <div className="space-y-4">
      {section.items.map((item, index) => (
        <TagItemEditor
          key={item.id}
          item={item as TagEntry}
          sectionId={section.id}
          index={index}
          totalItems={section.items.length}
        />
      ))}
    </div>
  )
}

export default TagSectionEditor
