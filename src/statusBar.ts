import { ExtensionContext, StatusBarAlignment, StatusBarItem, ThemeColor, window } from 'vscode'
import { setting } from './setting'
import { API_URL, EXTENSION_ID, PRICE_FIELD, SYMBOL_FIELD } from './constants'

class StatusBar {
  _context: ExtensionContext | null = null
  statusBarItem: StatusBarItem | null = null

  apiUrl: string | null | undefined = null
  priceField: string | null | undefined = null
  symbolField: string | null | undefined = null

  fetchInterval: any = null

  init(context: ExtensionContext) {
    console.log(`🚀 [${EXTENSION_ID} - StatusBar] Initializing...`)
    this._context = context
    this.start()
    console.log(`🚀 [${EXTENSION_ID} - StatusBar] Initialized!`)
  }

  private start() {
    if (!this._context) return
    this.apiUrl = setting?.config?.get(API_URL) || null
    this.priceField = setting?.config?.get(PRICE_FIELD) || null
    this.symbolField = setting?.config?.get(SYMBOL_FIELD) || null

    if (this.apiUrl && this.priceField && this.symbolField) {
      this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0)
      this._context.subscriptions.push(this.statusBarItem)
      this.statusBarItem.text = '$(megaphone) Starting...'
      this.statusBarItem.backgroundColor = new ThemeColor('statusBarItem.warningBackground')
      this.statusBarItem.show()
      this.startWatching()
    }
  }

  private startWatching() {
    if (!this.apiUrl || !this.statusBarItem) {
      return
    }
    console.log(`🚀 [${EXTENSION_ID} - StatusBar] Start watching...`)
    const apiUrl = this.apiUrl
    this.fetchInterval = setInterval(() => {
      fetch(apiUrl)
        .then((res) => res.json())
        .then((res: any) => {
          if (res && this.statusBarItem) {
            console.log(`📣 [${EXTENSION_ID}]`, res)
            let symbol = null
            let price = null
            if (this.symbolField && typeof res[this.symbolField] !== 'undefined') {
              symbol = res[this.symbolField]
            }
            if (this.priceField && typeof res[this.priceField] !== 'undefined') {
              price = res[this.priceField]
            }
            if (symbol && price) {
              this.statusBarItem.text = '$(megaphone)' + ` ${symbol} ${price}`
              this.statusBarItem.backgroundColor = new ThemeColor('statusBarItem.activeBackground')
              this.statusBarItem.show()
            } else {
              this.statusBarItem.text = 'Error'
              this.statusBarItem.backgroundColor = new ThemeColor('statusBarItem.errorBackground')
              this.statusBarItem.show()
            }
          }
        })
        .catch((err) => {
          console.log(err)
          if (this.statusBarItem) {
            this.statusBarItem.text = 'Error'
            this.statusBarItem.backgroundColor = new ThemeColor('statusBarItem.errorBackground')
            this.statusBarItem.show()
          }
        })
    }, 10000)
  }

  onSettingUpdate() {
    this.stopWatching()
    this.start()
  }

  stopWatching() {
    if (!this.fetchInterval) {
      return
    }
    console.log(`🚀 [${EXTENSION_ID} - StatusBar] Stopping...`)
    clearInterval(this.fetchInterval)
    this.statusBarItem?.dispose()
  }
}

export const statusBar = new StatusBar()
