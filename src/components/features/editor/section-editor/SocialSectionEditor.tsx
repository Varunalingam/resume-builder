import type { Section, SocialEntry } from '../../../../types/resume.types.ts'
import SocialItemEditor from '../item-editor/SocialItemEditor.tsx'

interface SocialSectionEditorProps {
  section: Section
}

const SocialSectionEditor = ({ section }: SocialSectionEditorProps) => {
  return (
    <div className="space-y-4">
      {section.items.map((item, index) => (
        <SocialItemEditor
          key={item.id}
          item={item as SocialEntry}
          sectionId={section.id}
          index={index}
          totalItems={section.items.length}
        />
      ))}
    </div>
  )
}

export default SocialSectionEditor
