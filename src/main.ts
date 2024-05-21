import './style.scss'
import { path, Plugin, PluginSettings, SettingTab, decorate } from '@typora-community-plugin/core'
import { editor } from 'typora'
import { fileExtensionIcons } from './file-icons'


interface FileIconSettings {
  fileExtensions: Record<string, string>
}

const DEFAULT_SETTINGS: FileIconSettings = {
  fileExtensions: fileExtensionIcons(),
}

export default class FileIconPlugin extends Plugin<FileIconSettings> {

  async onload() {
    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)

    this.register(
      decorate.returnValue(editor.library.fileTree, 'renderNode', ([file], node) => {

        if (file.isDirectory) return node

        const fileExtensions = this.settings.get('fileExtensions')
        const ext = path.extname(file.name)

        node.find('.file-node-icon')
          .slice(0, 1)
          .removeClass('fa-file-text-o')
          .addClass(fileExtensions[ext] || 'fa-file-o')
        return node
      }))

    this.registerSettingTab(new FileIconSettingTab(this))

    editor.library.refreshPanelCommand()
  }
}

class FileIconSettingTab extends SettingTab {

  get name() {
    return 'File Icon'
  }

  constructor(private plugin: FileIconPlugin) {
    super()
  }

  onload() {
    const fileExtensions = this.plugin.settings.get('fileExtensions')

    this.addSettingTitle('File Name Icons')
    this.addSetting(setting => {
      setting.addTable(table => {
        table
          .setHeaders([
            { title: 'File Name', prop: 'name', type: 'text' },
            { title: 'Icon Classname', prop: 'icon', type: 'text' },
          ])
          .setData(
            Object.keys(fileExtensions).map(k => ({
              name: k,
              icon: fileExtensions[k],
            }))
          )
          .onRowChange(row => {
            if (!row.name) return
            fileExtensions[row.name] = row.icon
            this.plugin.settings.set('fileExtensions', fileExtensions)
          })
          .onRowRemove(row => {
            delete fileExtensions[row.name]
            this.plugin.settings.set('fileExtensions', fileExtensions)
          })
      })
    })
  }
}
