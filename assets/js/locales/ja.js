export default {
  message: {
    title: 'Vue 3 ローダー',
    app: {
      subtitle: 'Pinia、Vue Demi、i18n を備えた最新の Vue 3 初期化ツールキット',
      description: '開発プロセスを簡素化するように設計されており、状態管理とアプリケーションの国際化のための強固な基盤を提供します。',
      language: '言語',
    },
    store: {
      store_state: 'ストアの状態',
      count: 'カウント',
      loaded_at: 'ロード日時',
      increment: '増加',
      pinia_message: 'Pinia ストアからこんにちは！'
    },
    loader: {
      assets: 'アセット',
      libraries: 'ライブラリ',
      components: 'コンポーネント',
      store: 'ストア',
      app: 'アプリ',
      finalizing: '完了中',
      initializing: '初期化中...',
      loading: '{item} を読み込み中...',
      starting_app: 'メインアプリを起動中...',
      error_loading: '[{stage}] の読み込み中にエラーが発生しました: {message}',
      status_label: 'ステータス:',
      velocity_label: '速度:',
      critical_failure: '重大な障害',
    },
    errors: {
      failed_to_load: '{item} の読み込みに失敗しました: {message}',
      network_error: 'ネットワークエラー',
      not_found: '見つかりません',
      something_went_wrong: '何かがうまくいきませんでした',
      init_failed: 'initMainApp が失敗を報告しました',
      init_undefined: 'initMainApp が定義されていません',
      unknown_error: '不明なエラー',
      network_error_checking: '{item} の確認中にネットワークエラーが発生しました: {message}',
      script_execution_failed: 'スクリプトの実行に失敗しました: {message}',
      failed_to_load_script: 'スクリプトタグの読み込みに失敗しました: {item}'
    },
  }
};
