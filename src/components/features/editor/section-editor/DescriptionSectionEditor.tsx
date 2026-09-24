import type {
  DescriptionEntry,
  Section,
} from '../../../../types/resume.types.ts'
import DescriptionItemEditor from '../item-editor/DescriptionItemEditor.tsx'

interface DescriptionSectionEditorProps {
  section: Section
}

const DescriptionSectionEditor = ({
  section,
}: DescriptionSectionEditorProps) => {
  return (
    <div className="space-y-4">
      {section.items.map((item, index) => (
        <DescriptionItemEditor
          key={item.id}
          item={item as DescriptionEntry}
          sectionId={section.id}
          index={index}
          totalItems={section.items.length}
        />
      ))}
    </div>
  )
}

export default DescriptionSectionEditor
