import { File } from 'typora'


type IconOfExtensions = {
  icon: string,
  extensions: string[],
}

const iconOfExtensions: IconOfExtensions[] = [
  {
    icon: 'ty-file-icon ty-fi-css',
    extensions: ['.css'],
  },
  {
    icon: 'ty-file-icon ty-fi-html',
    extensions: ['.htm', '.html'],
  },
  {
    icon: 'ty-file-icon ty-fi-javascript',
    extensions: ['.js', '.cjs', '.mjs'],
  },
  {
    icon: 'ty-file-icon ty-fi-json',
    extensions: ['.json'],
  },
  {
    icon: 'ty-file-icon ty-fi-markdown',
    extensions: File.SupportedFiles
      .filter(Boolean)
      .map(s => '.' + s),
  },
  {
    icon: 'fa-file-pdf-o',
    extensions: ['.pdf'],
  },
  {
    icon: 'fa-file-photo-o',
    extensions: ['.bmp', '.gif', '.jpg', '.png', '.svg', '.webp'],
  },
  {
    icon: 'fa-file-powerpoint-o',
    extensions: ['.ppt', '.pptx'],
  },
  {
    icon: 'fa-table',
    extensions: ['.csv'],
  },
  {
    icon: 'fa-file-text-o',
    extensions: ['.text', '.txt'],
  },
  {
    icon: 'fa-file-word-o',
    extensions: ['.doc', '.docx'],
  },
  {
    icon: 'fa-file-excel-o',
    extensions: ['.xls', '.xlsx'],
  },
  {
    icon: 'fa-file-zip-o',
    extensions: ['.7z', '.rar', '.zip'],
  },
]

export function fileExtensionIcons() {
  return iconOfExtensions.reduce((o, item) => {
    item.extensions.forEach(ext => {
      o[ext] = item.icon
    })
    return o
  }, {} as Record<string, string>)
}
