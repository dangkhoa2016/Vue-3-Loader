export default {
  message: {
    title: 'Vue 3 로더',
    app: {
      subtitle: 'Pinia, Vue Demi 및 i18n을 갖춘 최신 Vue 3 초기화 툴킷',
      description: '개발 프로세스를 간소화하도록 설계되었으며, 상태 관리 및 애플리케이션 국제화를 위한 견고한 기반을 제공합니다.',
      language: '언어',
    },
    store: {
      store_state: '스토어 상태',
      count: '카운트',
      loaded_at: '로드 시간',
      increment: '증가',
      pinia_message: 'Pinia 스토어에서 안녕하세요!'
    },
    loader: {
      assets: '자산',
      libraries: '라이브러리',
      components: '구성 요소',
      store: '스토어',
      app: '앱',
      finalizing: '마무리 중',
      initializing: '초기화 중...',
      loading: '{item} 로드 중...',
      starting_app: '메인 앱 시작 중...',
      error_loading: '[{stage}] 로드 중 오류 발생: {message}',
      system_loading: '시스템 로딩 중',
      system_diagnostic: '시스템 진단',
    },
    errors: {
      failed_to_load: '{item} 로드 실패: {message}',
      network_error: '네트워크 오류',
      not_found: '찾을 수 없음',
      something_went_wrong: '문제가 발생했습니다',
      init_failed: 'initMainApp 실패 보고됨',
      init_undefined: 'initMainApp이 정의되지 않았습니다',
      unknown_error: '알 수 없는 오류',
      network_error_checking: '{item} 확인 중 네트워크 오류: {message}',
      script_execution_failed: '스크립트 실행 실패: {message}',
      failed_to_load_script: '스크립트 태그 로드 실패: {item}'
    },
  }
};
