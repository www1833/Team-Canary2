// 共通で使用するメンバーデータのキー
const STORAGE_KEY = 'canary-army-members';

// ダミーデータ（初期データ）
const defaultMembers = [
  { id: 'm1', number: 1, name: '佐藤 太一', position: '投手', style: '右投げ右打ち', comment: '剛速球と多彩な変化球で攻めるエース。' },
  { id: 'm2', number: 2, name: '鈴木 亮介', position: '捕手', style: '右投げ右打ち', comment: '投手陣をまとめる頼れる女房役。' },
  { id: 'm3', number: 6, name: '田中 健', position: '内野手', style: '右投げ左打ち', comment: '広角に打ち分けるリードオフマン。' },
  { id: 'm4', number: 8, name: '高橋 悠斗', position: '外野手', style: '右投げ右打ち', comment: '俊足を生かした広い守備範囲が武器。' },
  { id: 'm5', number: 10, name: '中村 友紀', position: '内野手', style: '右投げ右打ち', comment: '勝負強い打撃でチャンスを広げる。' },
  { id: 'm6', number: 15, name: '伊藤 航', position: '投手', style: '左投げ左打ち', comment: '緩急自在のコントロールが光る技巧派。' },
  { id: 'm7', number: 23, name: '小林 翔', position: '外野手', style: '右投げ左打ち', comment: '豪快なスイングが魅力の長距離砲。' },
  { id: 'm8', number: 27, name: '山本 愛', position: '捕手', style: '右投げ右打ち', comment: '細やかな配球とリーダーシップで試合を支える。' }
];

// localStorage からメンバーを取得
function loadMembers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('メンバーデータの読み込みに失敗しました', error);
    return null;
  }
}

// localStorage にメンバーを保存
function saveMembers(members) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (error) {
    console.error('メンバーデータの保存に失敗しました', error);
  }
}

// localStorage 上のデータを初期化
function resetMembers() {
  saveMembers(defaultMembers);
}

// ナビゲーションのハイライト処理
function setupNavigation() {
  const body = document.body;
  const currentPage = body.dataset.page;
  const toggle = document.querySelector('.site-nav__toggle');
  const navList = document.querySelector('.site-nav__list');
  const navLinks = document.querySelectorAll('.site-nav__list a');

  navLinks.forEach((link) => {
    const target = link.dataset.navTarget;
    if (target === currentPage) {
      link.classList.add('is-active');
    }
  });

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// メインページ：お問い合わせフォームの送信処理
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('送信ありがとうございました！\n※このフォームはデモ用です。');
    form.reset();
  });
}

// メンバー紹介ページの初期化
function setupMembersPage() {
  const grid = document.getElementById('member-grid');
  if (!grid) return;

  const filterSelect = document.getElementById('position-filter');
  const sortButton = document.getElementById('sort-number');
  let isAscending = true;

  const getMembers = () => {
    const stored = loadMembers();
    return stored && stored.length > 0 ? stored : defaultMembers;
  };

  const renderMembers = () => {
    const members = [...getMembers()];
    const selectedPosition = filterSelect.value;

    let filtered = members;
    if (selectedPosition !== 'all') {
      filtered = members.filter((member) => member.position === selectedPosition);
    }

    filtered.sort((a, b) => {
      if (isAscending) {
        return a.number - b.number;
      }
      return b.number - a.number;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="empty-message">該当するメンバーが見つかりませんでした。</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((member) => {
      const card = document.createElement('article');
      card.className = 'member-card';
      card.innerHTML = `
        <span class="member-card__number">#${member.number}</span>
        <h3 class="member-card__name">${member.name}</h3>
        <div class="member-card__meta">
          <span>${member.position}</span>
          <span>${member.style}</span>
        </div>
        <p class="member-card__comment">${member.comment}</p>
      `;
      fragment.appendChild(card);
    });
    grid.innerHTML = '';
    grid.appendChild(fragment);
  };

  filterSelect.addEventListener('change', () => {
    renderMembers();
  });

  sortButton.addEventListener('click', () => {
    isAscending = !isAscending;
    sortButton.textContent = isAscending ? '背番号順（昇順）' : '背番号順（降順）';
    sortButton.setAttribute('aria-pressed', String(isAscending));
    renderMembers();
  });

  renderMembers();
}

// 管理画面の初期化
function setupAdminPage() {
  const form = document.getElementById('member-form');
  const tableBody = document.getElementById('member-table-body');
  if (!form || !tableBody) return;

  const idField = document.getElementById('member-id');
  const numberField = document.getElementById('member-number');
  const nameField = document.getElementById('member-name');
  const positionField = document.getElementById('member-position');
  const styleField = document.getElementById('member-style');
  const commentField = document.getElementById('member-comment');
  const submitButton = document.getElementById('submit-button');
  const resetFormButton = document.getElementById('reset-form');
  const resetDataButton = document.getElementById('reset-data');

  const getMembers = () => {
    const stored = loadMembers();
    return stored && stored.length > 0 ? stored : defaultMembers;
  };

  const renderTable = () => {
    const members = [...getMembers()].sort((a, b) => a.number - b.number);
    if (members.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6">登録されているメンバーはいません。</td></tr>';
      return;
    }

    const fragment = document.createDocumentFragment();

    members.forEach((member) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#${member.number}</td>
        <td>${member.name}</td>
        <td>${member.position}</td>
        <td>${member.style}</td>
        <td>${member.comment}</td>
        <td class="data-table__actions">
          <button type="button" class="data-table__edit" data-action="edit" data-id="${member.id}">編集</button>
          <button type="button" class="data-table__delete" data-action="delete" data-id="${member.id}">削除</button>
        </td>
      `;
      fragment.appendChild(row);
    });

    tableBody.innerHTML = '';
    tableBody.appendChild(fragment);
  };

  const clearForm = () => {
    idField.value = '';
    form.reset();
    submitButton.textContent = '追加';
  };

  const upsertMember = (member) => {
    const members = getMembers();
    const index = members.findIndex((item) => item.id === member.id);
    if (index >= 0) {
      members[index] = member;
    } else {
      members.push(member);
    }
    saveMembers(members);
    renderTable();
  };

  const deleteMember = (id) => {
    const members = getMembers().filter((member) => member.id !== id);
    saveMembers(members);
    renderTable();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const existingId = idField.value || `m${Date.now()}`;
    const member = {
      id: existingId,
      number: Number(numberField.value),
      name: nameField.value.trim(),
      position: positionField.value,
      style: styleField.value.trim(),
      comment: commentField.value.trim()
    };

    if (!member.name || !member.style || !member.comment) {
      alert('未入力の項目があります。');
      return;
    }

    upsertMember(member);
    clearForm();
  });

  tableBody.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === 'edit') {
      const members = getMembers();
      const member = members.find((item) => item.id === id);
      if (!member) return;
      idField.value = member.id;
      numberField.value = member.number;
      nameField.value = member.name;
      positionField.value = member.position;
      styleField.value = member.style;
      commentField.value = member.comment;
      submitButton.textContent = '更新';
      window.scrollTo({ top: form.offsetTop - 80, behavior: 'smooth' });
    } else if (action === 'delete') {
      if (confirm('選択したメンバーを削除しますか？')) {
        deleteMember(id);
      }
    }
  });

  resetFormButton.addEventListener('click', () => {
    clearForm();
  });

  resetDataButton.addEventListener('click', () => {
    if (confirm('メンバーを初期ダミーデータに戻します。よろしいですか？')) {
      resetMembers();
      clearForm();
      renderTable();
      alert('ダミーデータにリセットしました。');
    }
  });

  // localStorage にデータがない場合は初期データを保存
  if (!loadMembers()) {
    resetMembers();
  }

  renderTable();
}

// 初期化処理
window.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupContactForm();
  setupMembersPage();
  setupAdminPage();
});
