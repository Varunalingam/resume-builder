import type { Section, StandardEntry } from '../../../../types/resume.types.ts'
import StandardItemEditor from '../item-editor/StandardItemEditor.tsx'

interface StandardSectionEditorProps {
  section: Section
}

const StandardSectionEditor = ({ section }: StandardSectionEditorProps) => {
  return (
    <div className="space-y-4">
      {section.items.map((item, index) => (
        <StandardItemEditor
          key={item.id}
          item={item as StandardEntry}
          sectionId={section.id}
          index={index}
          totalItems={section.items.length}
        />
      ))}
    </div>
  )
}

export default StandardSectionEditor
