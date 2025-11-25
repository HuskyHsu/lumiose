# Google Analytics 說明

## 功能說明

### 自動追蹤功能

- ✅ **頁面瀏覽追蹤**: 自動追蹤所有路由變更
- ✅ **單頁應用支援**: 完整支援 React Router 路由變更

### 可用的追蹤函數

#### 1. 追蹤自定義事件

```typescript
import { trackEvent } from '@/lib/analytics';

// 追蹤按鈕點擊
trackEvent('click', 'button', 'pokemon-card', 1);
```

#### 2. 追蹤自定義事件（進階）

```typescript
import { trackCustomEvent } from '@/lib/analytics';

// 追蹤寶可夢搜尋
trackCustomEvent('pokemon_search', {
  search_term: 'pikachu',
  results_count: 1,
  user_language: 'zh-TW',
});
```

#### 3. 手動追蹤頁面瀏覽

```typescript
import { trackPageView } from '@/lib/analytics';

// 手動追蹤特定頁面
trackPageView('/pokemon/pikachu', 'Pikachu - Pokédex');
```

## 使用範例

### 在組件中追蹤事件

```typescript
import { trackEvent, trackCustomEvent } from '@/lib/analytics';

const PokemonCard = ({ pokemon }) => {
  const handleCardClick = () => {
    // 追蹤寶可夢卡片點擊
    trackEvent('click', 'pokemon_card', pokemon.name);

    // 或使用自定義事件
    trackCustomEvent('pokemon_card_click', {
      pokemon_name: pokemon.name,
      pokemon_id: pokemon.id,
      pokemon_type: pokemon.types[0],
    });
  };

  return <div onClick={handleCardClick}>{/* 卡片內容 */}</div>;
};
```

## 檔案結構

```
src/
├── lib/
│   └── analytics.ts          # GA 配置和追蹤函數
├── hooks/
│   └── useAnalytics.ts       # React hook 用於初始化 GA
└── App.tsx                   # 主要應用程式（已整合 GA）
```

## 注意事項

1. **隱私權**: 確保你的網站有適當的隱私權政策
2. **GDPR 合規**: 如果你的用戶來自歐盟，請考慮 GDPR 合規性
3. **開發環境**: GA 在開發環境中也會運作，建議使用不同的 Measurement ID
4. **效能**: GA 腳本是異步載入的，不會影響頁面載入速度

## 疑難排解

### 檢查 GA 是否正常運作

1. 開啟瀏覽器開發者工具
2. 前往 Network 標籤
3. 重新載入頁面
4. 搜尋 `google-analytics` 或 `gtag` 相關的網路請求

### 常見問題

- **沒有資料**: 檢查 Measurement ID 是否正確
- **環境變數無效**: 確保 `.env` 檔案在專案根目錄且變數名稱正確
- **開發環境沒有資料**: GA 資料可能需要幾分鐘才會顯示
- **`net::ERR_BLOCKED_BY_CLIENT` 錯誤**:
  - 這是**正常現象**，表示瀏覽器的廣告攔截器或隱私保護擴充功能阻擋了 GA 腳本
  - 常見的攔截器：AdBlock、uBlock Origin、Privacy Badger 等
  - **解決方案**：
    1. 暫時停用廣告攔截器來測試 GA 功能
    2. 將你的開發網域加入攔截器的白名單
    3. 在生產環境中，大部分用戶不會有這個問題
  - **注意**：即使被攔截，你的追蹤代碼仍然正常運作，只是資料不會被發送到 GA

## 已實施的監控功能

### 1. 寶可夢卡片點擊追蹤

**位置**: `src/components/pokemon/Card.tsx`

- **事件**: `pokemon_card_click`
- **追蹤資料**:
  - 寶可夢名稱 (英文)
  - 寶可夢 ID
  - 主要屬性
  - 次要屬性
  - 當前頁面位置

### 2. 搜尋功能追蹤

**位置**: `src/components/ui/SearchFilter.tsx`

- **搜尋事件**: `pokemon_search`
  - 搜尋關鍵字
  - 搜尋字串長度
- **清除搜尋事件**: `pokemon_search_clear`
  - 之前的搜尋關鍵字

### 3. 屬性篩選追蹤

**位置**: `src/components/ui/TypeFilter.tsx`

- **選擇屬性**: `type_filter_select`
- **取消選擇屬性**: `type_filter_deselect`
- **追蹤資料**:
  - 選擇的寶可夢屬性
  - 目前選擇的所有屬性
  - 選擇的屬性總數
  - 之前的選擇狀態

### 4. 閃光寶可夢切換追蹤

**位置**: `src/components/ui/ShinyToggle.tsx`

- **事件**: `shiny_toggle`
- **追蹤資料**:
  - 新狀態 (開啟/關閉)
  - 之前狀態

### 5. 最終形態篩選追蹤

**位置**: `src/components/ui/FinalFormToggle.tsx`

- **事件**: `final_form_toggle`
- **追蹤資料**:
  - 新狀態 (開啟/關閉)
  - 之前狀態

### 6. 寶可夢詳細頁面追蹤

**位置**: `src/pages/pokemon/index.tsx`

- **頁面瀏覽**: 手動追蹤特定寶可夢頁面
- **詳細頁面檢視事件**: `pokemon_detail_view`
  - 寶可夢名稱 (英文)
  - 寶可夢 ID
  - 主要屬性
  - 次要屬性
- **寶可夢導航事件**: `pokemon_navigation`
  - 來源寶可夢
  - 目標寶可夢
  - 導航類型

## 監控事件總覽

| 事件名稱               | 觸發時機               | 主要資料             |
| ---------------------- | ---------------------- | -------------------- |
| `pokemon_card_click`   | 點擊寶可夢卡片         | 寶可夢資訊、頁面位置 |
| `pokemon_search`       | 搜尋寶可夢 (延遲 1 秒) | 搜尋關鍵字、字串長度 |
| `pokemon_search_clear` | 清除搜尋               | 之前的搜尋關鍵字     |
| `type_filter_select`   | 選擇屬性篩選           | 屬性、選擇狀態       |
| `type_filter_deselect` | 取消屬性篩選           | 屬性、選擇狀態       |
| `shiny_toggle`         | 切換閃光模式           | 新舊狀態             |
| `final_form_toggle`    | 切換最終形態篩選       | 新舊狀態             |
| `pokemon_detail_view`  | 檢視寶可夢詳細頁面     | 寶可夢完整資訊       |
| `pokemon_navigation`   | 在詳細頁面間導航       | 來源與目標寶可夢     |

## 進階配置

如果需要更進階的配置（如自定義維度、電子商務追蹤等），可以修改 `src/lib/analytics.ts` 檔案中的 `initGA` 函數。
