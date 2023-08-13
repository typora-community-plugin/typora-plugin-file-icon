import * as path from 'path'
import { Plugin, SettingTab, decorate } from '@typora-community-plugin/core'
import { editor } from 'typora'
import { fileExtensionIcons } from './file-icons'


interface FileIconSettings {
  fileExtensions: Record<string, string>
}

const DEFAULT_SETTINGS: FileIconSettings = {
  fileExtensions: fileExtensionIcons(),
}

export default class FileIconPlugin extends Plugin {

  settings: FileIconSettings

  async onload() {
    await this.loadSettings()

    this.register(
      decorate.returnValue(editor.library.fileTree, 'renderNode', ([file], node) => {

        if (file.isDirectory) return node

        const { fileExtensions } = this.settings
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

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
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
    const { fileExtensions } = this.plugin.settings

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
            this.plugin.saveSettings()
          })
          .onRowRemove(row => {
            delete fileExtensions[row.name]
            this.plugin.saveSettings()
          })
      })
    })
  }
}
