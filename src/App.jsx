import { Fragment, useEffect, useState } from "react";
import {
  IconArrowLeft, IconArrowRight, IconArrowsMaximize, IconBolt, IconBook2, IconBuilding, IconChartBar, IconChartLine,
  IconChevronDown, IconChevronRight, IconCircleCheck, IconCloud, IconCoins,
  IconCopy, IconDatabase, IconDownload, IconFileCheck, IconFileDescription, IconFilter,
  IconFolder, IconFolderPlus, IconFootsteps, IconLayoutGrid,
  IconLayoutSidebarLeftCollapse, IconLeaf, IconListDetails, IconLoader2, IconMapPin,
  IconMessagePlus, IconNetwork, IconPaperclip, IconReportAnalytics, IconRoute, IconBell, IconDots, IconPlus,
  IconScale, IconSearch, IconSend2, IconShieldCheck, IconSparkles, IconTargetArrow,
  IconUserCircle, IconUsersGroup, IconWorld, IconX,
} from "@tabler/icons-react";
import { chatInsights, dimensionCatalog, getFieldRecord, sourceFiles, totalFieldCount } from "./carbonData";
import { esgPerformanceCatalog, esgYears } from "./esgData";

const appRouteUrl = (route) => `${import.meta.env.BASE_URL}#/${route.replace(/^\//, "")}`;
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const projects = [
  ["2024年企业碳核算", "组织"], ["2025年碳阻迹研究", "组织"],
  ["宁德时代碳情报", "企业"], ["2023年碳阻迹研究", "组织"],
  ["2007企业核算", "组织"], ["2008年碳阻迹研究", "组织"],
];

const companies = [
  { id: "huaneng", short: "华能", name: "华能国际电力股份有限公司", enterpriseCode: "HNPI-600011-CN", creditCode: "91110000625905205U", legalPerson: "王葵", regStatus: "在营（开业）", companyType: "股份有限公司", established: "1994-06-30", code: "600011.SH / 0902.HK", securityCode: "600011 / 0902", exchange: "上海证券交易所 / 香港联交所", industry: "电力生产", city: "河北·雄安", completeness: 94, updated: "2026-08-25", scope12: "1,083.2 万 tCO₂e", target: "2060 碳中和", tags: ["国有企业", "A+H股", "第三方鉴证"] },
  { id: "catl", short: "CATL", name: "宁德时代新能源科技股份有限公司", enterpriseCode: "CATL-300750-CN", creditCode: "91350900587527783P", legalPerson: "曾毓群", regStatus: "存续", companyType: "股份有限公司（上市）", established: "2011-12-16", code: "300750.SZ", securityCode: "300750", exchange: "深圳证券交易所", industry: "动力电池制造", city: "福建·宁德", completeness: 92, updated: "2026-08-25", scope12: "286.9 万 tCO₂e", target: "2035 碳中和", tags: ["SBTi", "第三方鉴证", "范围3已披露"] },
  { id: "byd", short: "BYD", name: "比亚迪股份有限公司", creditCode: "91440300192317458F", legalPerson: "王传福", regStatus: "存续", companyType: "股份有限公司（上市）", established: "1995-02-10", code: "002594.SZ / 1211.HK", industry: "新能源汽车", city: "广东·深圳", completeness: 88, updated: "2026-08-24", scope12: "811.3 万 tCO₂e", target: "2050 碳中和", tags: ["CDP B", "绿电 68.7%", "范围3部分披露"] },
  { id: "longi", short: "隆基", name: "隆基绿能科技股份有限公司", creditCode: "916101047101813521", legalPerson: "钟宝申", regStatus: "开业", companyType: "股份有限公司（上市）", established: "2000-02-14", code: "601012.SH", industry: "光伏制造", city: "陕西·西安", completeness: 91, updated: "2026-08-23", scope12: "334.6 万 tCO₂e", target: "2050 净零", tags: ["RE100", "SBTi", "EPD"] },
  { id: "zijin", short: "紫金", name: "紫金矿业集团股份有限公司", creditCode: "91350000157987632G", legalPerson: "陈景河", regStatus: "存续", companyType: "股份有限公司（上市）", established: "2000-09-06", code: "601899.SH / 2899.HK", industry: "有色金属", city: "福建·龙岩", completeness: 84, updated: "2026-08-22", scope12: "788.4 万 tCO₂e", target: "2050 碳中和", tags: ["高排放行业", "气候情景分析", "鉴证"] },
  { id: "baosteel", short: "宝钢", name: "宝山钢铁股份有限公司", creditCode: "91310000631696382C", legalPerson: "邹继新", regStatus: "存续", companyType: "股份有限公司（上市）", established: "2000-02-03", code: "600019.SH", industry: "钢铁", city: "上海", completeness: 86, updated: "2026-08-21", scope12: "8,345 万 tCO₂e", target: "2050 碳中和", tags: ["全国碳市场", "绿钢", "转型金融"] },
  { id: "midea", short: "美的", name: "美的集团股份有限公司", creditCode: "91440606722473344C", legalPerson: "方洪波", regStatus: "在营（开业）", companyType: "股份有限公司（上市）", established: "2000-04-07", code: "000333.SZ / 0300.HK", industry: "家用电器", city: "广东·佛山", completeness: 81, updated: "2026-08-20", scope12: "152.8 万 tCO₂e", target: "2060 碳中和", tags: ["绿色工厂", "产品碳足迹", "供应链减碳"] },
  { id: "sinopec", short: "中石化", name: "中国石油化工股份有限公司", code: "600028.SH / 0386.HK", industry: "石油化工", city: "北京", updated: "2026-08-19", scope12: "5,280 万 tCO₂e", target: "2050 净零" },
  { id: "chnenergy", short: "国能", name: "国家能源投资集团有限责任公司", code: "央企", industry: "能源电力", city: "北京", updated: "2026-08-18", scope12: "12,680 万 tCO₂e", target: "2060 碳中和" },
  { id: "geely", short: "吉利", name: "吉利汽车控股有限公司", code: "0175.HK", industry: "汽车制造", city: "浙江·杭州", updated: "2026-08-17", scope12: "226.4 万 tCO₂e", target: "2045 碳中和" },
  { id: "tencent", short: "腾讯", name: "腾讯控股有限公司", code: "0700.HK", industry: "互联网服务", city: "广东·深圳", updated: "2026-08-16", scope12: "61.2 万 tCO₂e", target: "2030 碳中和" },
  { id: "cscec", short: "中建", name: "中国建筑股份有限公司", code: "601668.SH", industry: "建筑工程", city: "北京", updated: "2026-08-15", scope12: "1,946 万 tCO₂e", target: "2060 碳中和" },
];

const dimensions = dimensionCatalog.map((item) => [item.name, item.fields.length]);

const archiveSections = [
  { icon: IconChartBar, label: "排放核算", value: "2,868,927 tCO₂e", note: "2024 范围1+2 · 同比下降 8.1%", status: "已鉴证" },
  { icon: IconTargetArrow, label: "目标与承诺", value: "2035 核心运营碳中和", note: "已通过 SBTi 目标验证", status: "进行中" },
  { icon: IconBolt, label: "能源与资源", value: "绿电占比 64.3%", note: "可再生能源使用量持续提升", status: "已披露" },
  { icon: IconLeaf, label: "减排行动", value: "零碳工厂 9 座", note: "节能、绿电、储能和循环利用", status: "12 项行动" },
  { icon: IconCoins, label: "碳市场与资产", value: "未纳入全国碳市场", note: "持有绿证及 I-REC 使用记录", status: "持续跟踪" },
  { icon: IconNetwork, label: "供应链碳管理", value: "CREDIT 价值链计划", note: "推动核心供应商披露碳数据", status: "覆盖 72%" },
  { icon: IconShieldCheck, label: "合规与风险", value: "未发现重大环境处罚", note: "近 36 个月监管信息", status: "低风险" },
  { icon: IconFileCheck, label: "披露与证据", value: "18 个官方数据源", note: "42 个证据片段 · 4 份核心报告", status: "92% 完整" },
];

function Sidebar({ view, onNavigate }) {
  const productNav = [
    [IconFootsteps, "产品碳足迹"], [IconFileDescription, "企业碳核算"], [IconWorld, "CBAM"],
  ];
  return <aside className="sidebar">
    <div className="brand-row"><div className="brand-crop" aria-label="Carbon Agent"><img src={assetUrl("assets/current-carbon-agent.png")} alt="Carbon Agent" /></div><button className="icon-button" aria-label="收起侧栏"><IconLayoutSidebarLeftCollapse size={19} /></button></div>
    <button className={`new-chat ${view === "chat" ? "selected" : ""}`} onClick={() => onNavigate("chat")}><IconMessagePlus size={18} /> 新对话</button>
    <nav className="primary-nav">
      {productNav.map(([Icon, label]) => <button key={label}><Icon size={19} /><span>{label}</span><IconChevronRight size={16} /></button>)}
      <button className={view !== "chat" ? "active-knowledge" : ""} onClick={() => onNavigate("companies")}><IconBook2 size={19} /><span>关注的企业</span><IconChevronRight size={16} /></button>
    </nav>
    <div className="project-heading"><span>项目</span><button className="icon-button"><IconFolderPlus size={18} /></button></div>
    <div className="projects">{projects.map(([name, tag]) => <button key={name}><IconFolder size={17} /><span>{name}</span><em>{tag}</em></button>)}</div>
    <div className="sidebar-bottom"><button className="credits"><IconSparkles size={16} />1577 <span>升级</span></button><button className="account"><IconUserCircle size={30} /><span><strong>我的</strong><small>个人版</small></span><IconChevronRight size={18} /></button></div>
  </aside>;
}

function CompanyIdentity({ company, compact = false }) {
  return <div className={`company-identity ${compact ? "compact" : ""}`}>
    <div className="company-logo"><IconBuilding size={22} /></div>
    <div className="identity-main"><h2>{company.name}</h2><p>{company.code} · {company.industry} · {company.city}</p><div className="company-tags">{company.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    <div className="identity-score"><strong>{company.completeness}%</strong><span>档案完整度</span></div>
  </div>;
}

function CarbonArchive({ company = companies[0], chat = false, onOpenDetail }) {
  return <section className={`carbon-archive ${chat ? "archive-in-chat" : ""}`}>
    <CompanyIdentity company={company} compact={chat} />
    <div className="archive-summary">
      <div><span>2024 范围 1</span><strong>587,834</strong><small>tCO₂e</small></div>
      <div><span>2024 范围 2</span><strong>2,281,093</strong><small>tCO₂e · 市场法</small></div>
      <div><span>范围 3</span><strong>10/15</strong><small>类别已披露</small></div>
      <div><span>碳目标</span><strong>2035</strong><small>核心运营碳中和</small></div>
    </div>
    <div className="archive-section-grid">{archiveSections.map(({ icon: Icon, label, value, note, status }) => <article key={label}><div className="archive-icon"><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><p>{note}</p></div><em>{status}</em></article>)}</div>
    <div className="dimension-strip"><div><strong>15 个碳管理维度</strong><span>完整字段目录共 {totalFieldCount} 项</span></div><div className="dimension-chips">{dimensions.map(([name, count]) => <span key={name}>{name}<b>{count}</b></span>)}</div></div>
    <div className="archive-footer"><span><IconCircleCheck size={16} /> 基于企业官网、交易所、生态环境部门及国际倡议等 18 个数据源</span>{chat && <button className="secondary-button" onClick={onOpenDetail}>进入完整企业碳档案 <IconArrowRight size={16} /></button>}</div>
  </section>;
}

function ArchiveOverview({ company }) {
  const basicFields = [
    ["企业名称", company.name],
    ["企业编码", company.enterpriseCode || `CARBON-${company.id.toUpperCase()}-CN`],
    ["行业", company.industry],
    ["上市地点", company.exchange || (company.code.includes(".SH") ? "上海证券交易所" : "深圳证券交易所")],
    ["证券代码", company.securityCode || company.code],
  ];
  const coverageOffsets = [7, 2, -1, -9, -5, -7, -3, -12, -8, -16, -6, -10, -11, -4, -2];
  return <section className="archive-overview-card">
    <header><div><span>企业基础信息</span><strong>主体识别信息</strong></div><em>最后更新 {company.updated}</em></header>
    <dl className="archive-basic-info">{basicFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="archive-coverage-heading"><div><span>档案完整度</span><strong>15 个碳管理维度</strong></div><b>{company.completeness}% 综合完整度</b></div>
    <div className="archive-coverage-grid">{dimensionCatalog.map((dimension, index) => {
      const coverage = Math.max(52, Math.min(100, company.completeness + coverageOffsets[index]));
      const completed = Math.round(dimension.fields.length * coverage / 100);
      return <article key={dimension.name}><div><i>{String(index + 1).padStart(2, "0")}</i><strong>{dimension.name}</strong><b>{coverage}%</b></div><span>{completed} / {dimension.fields.length} 个字段完整</span><em><i style={{ width: `${coverage}%` }} /></em></article>;
    })}</div>
  </section>;
}

function EnterpriseConfirmCard({ onConfirm }) {
  const company = companies[0];
  const basicFields = [
    ["企业名称", company.name],
    ["企业编码", company.enterpriseCode],
    ["行业", company.industry],
    ["上市地点", company.exchange],
    ["证券代码", company.securityCode],
  ];
  return <div className="confirm-card"><div className="confirm-label"><IconDatabase size={16} />企业主数据匹配结果</div><div className="confirm-company-heading"><div className="company-logo"><IconBuilding size={22} /></div><div><strong>已匹配到企业主体</strong><span><IconCircleCheck size={14} />企业主数据已校验</span></div></div><dl className="confirm-basic-grid">{basicFields.map(([label, value], index) => <div key={label} className={index === 0 ? "wide" : ""}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="confirm-actions"><button className="primary-button" onClick={onConfirm}>确认查询这家企业 <IconArrowRight size={16} /></button><button className="secondary-button">不是这家，查看其他结果</button></div></div>;
}

function Composer({ routeMode, setRouteMode, value, setValue, onSubmit, loading }) {
  return <form className="composer new-composer" onSubmit={onSubmit}>
    {routeMode === "company" && <div className="route-note"><IconRoute size={14} />当前优先查询企业碳档案，未命中后再进入通用 RAG</div>}
    <div className="composer-input"><button type="button" className="attach-button" aria-label="上传资料"><IconPaperclip size={21} /></button><input value={value} onChange={(event) => setValue(event.target.value)} placeholder={routeMode === "company" ? "输入企业名称或碳管理问题，例如：查询宁德时代碳管理信息" : "描述产品、上传资料，或直接提问碳足迹建模/报告/资讯需求…"} aria-label="向 Carbon Agent 提问" /><button className="send-button" aria-label="发送" disabled={!value.trim() || loading}>{loading ? <IconLoader2 className="spin" size={19} /> : <IconSend2 size={19} />}</button></div>
    <div className="composer-tools"><button type="button">产品碳足迹建模</button><button type="button">企业碳核算</button><button type="button">CBAM报告创建</button><button type="button" className={routeMode === "company" ? "active" : ""} onClick={() => setRouteMode(routeMode === "company" ? "general" : "company")}><IconBook2 size={15} />企业碳知识</button></div>
  </form>;
}

function CitationReference({ file, dimension, excerpt, onOpen }) {
  return <span className="citation-wrap"><button className="citation-chip" onClick={() => onOpen({ ...file, dimension, excerpt })}><IconFileDescription size={13} /><span>{file.year}{file.type}</span></button><span className="citation-hover" role="tooltip"><small><IconFileDescription size={14} />{file.year} · {file.type}</small><strong>{file.title}</strong><span>定位：{dimension}相关章节 · 已解析{file.evidence}个证据片段</span><span>{excerpt}</span></span></span>;
}

function CitationReader({ source, onClose }) {
  if (!source) return null;
  return <aside className="citation-reader"><header><div><span>引用文件</span><strong>{source.title}</strong></div><button aria-label="关闭文件内容" onClick={onClose}><IconX size={19} /></button></header><div className="reader-meta"><span>{source.year}</span><span>{source.type}</span><span>{source.pages} 页</span><span>{source.status}</span></div><div className="reader-location"><IconSearch size={15} /><span>已定位到：{source.dimension}相关章节</span><button>在源文件中打开</button></div><div className="reader-body"><article className="document-page"><div className="page-mark">{source.year} 企业披露文件 · 第 {Math.min(68 + source.evidence, source.pages)} 页</div><h2>{source.dimension}</h2><p>公司持续推进碳管理体系建设，将温室气体排放核算、能源结构优化、目标管理和价值链协同纳入年度可持续发展工作。</p><p className="reader-highlight">{source.excerpt}</p><p>相关数据以报告期内纳入组织边界的经营实体为基础，并依据适用的核算标准进行统计。对于不同年份发生的边界调整和口径变化，档案保留历史版本和差异说明。</p><p>本段内容已经由 Carbon Agent 解析并关联至企业碳档案。点击字段来源可继续查看对应页码、表格及上下文。</p><footer>来源：{source.title}</footer></article></div><div className="reader-actions"><button className="secondary-button"><IconDownload size={15} />下载原文件</button><button className="primary-button">查看全部证据</button></div></aside>;
}

const cnNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"];

const reportTables = {
  0: { columns: ["主体字段", "识别结果", "状态"], rows: [["企业名称", "宁德时代新能源科技股份有限公司", "已确认"], ["证券代码", "300750.SZ", "已校验"], ["核算边界", "集团控制法，覆盖主要子公司与生产基地", "已归档"]] },
  2: { columns: ["排放范围", "2024年排放量", "数据状态"], rows: [["范围1（直接排放）", "587,834 tCO₂e", "已鉴证"], ["范围2（市场法）", "2,281,093 tCO₂e", "已鉴证"], ["范围3", "已披露10/15个类别", "部分披露"]] },
  3: { columns: ["阶段", "目标", "状态"], rows: [["近期", "核心运营持续降碳，提升绿电使用", "推进中"], ["2035年", "核心运营碳中和", "目标已验证"], ["价值链", "覆盖重点范围3类别和供应商", "持续扩展"]] },
  5: { columns: ["能源指标", "最新披露", "趋势"], rows: [["绿电占比", "64.3%", "上升"], ["零碳工厂", "9座", "增加"], ["环境权益", "绿证及I-REC", "已留存注销记录"]] },
  9: { columns: ["碳资产事项", "企业状态", "判断"], rows: [["全国碳市场", "未纳入重点排放单位", "无需履约"], ["绿证/I-REC", "持有并使用", "持续跟踪"], ["碳信用抵消", "未发现大规模依赖", "低依赖"]] },
  11: { columns: ["对标指标", "行业位置", "主要依据"], rows: [["目标验证", "较高", "SBTi目标已验证"], ["绿电使用", "较高", "绿电占比64.3%"], ["范围3完整性", "中等", "披露10/15个类别"]] },
};

const reportBullets = {
  1: ["归档年度报告、可持续发展报告、鉴证声明和气候专项文件。", "关键事实关联到原文页码、表格与历史版本。", "不同来源发生口径冲突时，优先采用企业正式披露与监管文件。"],
  4: ["推进节能技改、设备电气化与生产工艺升级。", "通过自建光伏、绿电采购和储能部署降低运营排放。", "开展电池回收与材料闭环，减少上游原材料碳足迹。"],
  6: ["近36个月未发现重大环境行政处罚。", "海外电池法规、碳足迹披露和供应链尽调是主要转型风险。", "不同报告的边界和口径差异仍需要持续监测。"],
  8: ["CREDIT价值链计划推动核心供应商开展碳盘查。", "重点供应商管理覆盖率约72%。", "上游材料排放和供应商产品足迹仍是主要数据缺口。"],
  10: ["董事会及管理层对可持续发展与气候议题进行监督。", "碳管理已嵌入采购、生产、能源和产品合规流程。", "碳数据内控及绩效薪酬挂钩信息仍有提升空间。"],
  12: ["已获得绿色工厂、零碳工厂等外部认定。", "持续投入节能降碳、清洁能源和循环经济项目。", "绿色收入占比及融资工具绩效需要进一步拆分披露。"],
  13: ["适用中国温室气体核算和可持续披露要求。", "出口产品受到欧盟电池法规及产品碳足迹规则影响。", "政策实施时间、过渡期和适用产品范围已纳入持续跟踪。"],
  14: ["水资源、生物多样性和废弃物表现需要与碳数据协同分析。", "员工安全、供应链人权和商业道德构成重要非碳风险。", "重大ESG争议应独立监测，避免仅凭碳指标判断企业表现。"],
};

function ReportDataTable({ table }) {
  if (!table) return null;
  return <div className="report-table"><div className="report-table-toolbar"><strong>表格</strong><div><button aria-label="复制表格"><IconCopy size={16} /></button><button aria-label="下载表格"><IconDownload size={17} /></button><button aria-label="展开表格"><IconArrowsMaximize size={16} /></button></div></div><div className="report-table-row head">{table.columns.map((column) => <strong key={column}>{column}</strong>)}</div>{table.rows.map((row, rowIndex) => <div className="report-table-row" key={rowIndex}>{row.map((cell, cellIndex) => <span className={cellIndex === row.length - 1 ? "status-cell" : ""} key={cell}>{cell}</span>)}</div>)}</div>;
}

function NaturalLanguageAnswer({ visibleCount, onOpenDetail }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const finished = visibleCount >= chatInsights.length;
  return <><article className={`natural-answer report-answer ${selectedSource ? "reader-open" : ""}`}>
    <div className="answer-lead"><IconCircleCheck size={18} /><div><strong>已确认：宁德时代新能源科技股份有限公司</strong><span>已按15个企业碳档案维度生成综合分析，结论均关联原始披露文件。</span></div></div>
    <p className="report-preface">综合企业公开披露、监管数据与国际倡议信息，宁德时代已形成覆盖运营核算、目标管理、产品与供应链减碳的管理体系。以下按企业碳档案的建议优先级展开，数据口径以最新可核验证据为准。</p>
    <div className="report-sections">
      {chatInsights.slice(0, visibleCount).map(([title, text], index) => { const file = sourceFiles[index % sourceFiles.length]; const bullets = reportBullets[index]; return <section key={title} className="report-section"><h2>{cnNumbers[index]}、{title}</h2><p>{text} <CitationReference file={file} dimension={title} excerpt={text} onOpen={setSelectedSource} /></p><ReportDataTable table={reportTables[index]} />{bullets && <ul>{bullets.map((bullet, bulletIndex) => <li key={bullet}>{bullet}{bulletIndex === bullets.length - 1 && <CitationReference file={sourceFiles[(index + 2) % sourceFiles.length]} dimension={title} excerpt={bullet} onOpen={setSelectedSource} />}</li>)}</ul>}</section>; })}
      {!finished && <div className="stream-cursor"><IconLoader2 className="spin" size={16} />正在继续检索并生成报告…</div>}
    </div>
    {finished && <div className="answer-conclusion"><div><strong>综合结论</strong><p>宁德时代的优势集中在目标验证、绿电使用、零碳工厂和供应链协同；后续应重点关注范围3完整性、产品足迹覆盖率及海外法规适配。</p></div><button className="primary-button archive-cta" onClick={onOpenDetail}>查看完整企业碳档案 <IconArrowRight size={16} /></button></div>}
  </article><CitationReader source={selectedSource} onClose={() => setSelectedSource(null)} /></>;
}

const resultEnterpriseInfo = [
  ["企业名称", "宁德时代新能源科技股份有限公司 / Contemporary Amperex Technology Co., Limited"],
  ["登记状态", "存续（在营、开业、在册）"],
  ["成立日期 / 核准日期", "2011-12-16 / 2026-08-25"],
  ["注册资本 / 实缴资本", "439,861.44 万人民币 / 439,861.44 万人民币"],
  ["企业类型", "股份有限公司（上市、自然人投资或控股）"],
  ["注册地址", "福建省宁德市蕉城区漳湾镇新港路2号"],
  ["联系方式", "0593-2583668 · www.catl.com"],
  ["登记机关 / 行业代码", "宁德市市场监督管理局 / C3841"],
  ["简易注销", "本次未发现公开记录"],
];

const carbonDataSummary = [
  ["范围1排放", "587,834", "tCO₂e"], ["范围2排放（市场法）", "2,281,093", "tCO₂e"],
  ["范围2排放（位置法）", "3,045,610", "tCO₂e"], ["范围3排放", "12,846,200", "tCO₂e · 已披露10/15类"],
  ["范围1+2总量（市场法）", "2,868,927", "tCO₂e"], ["范围1+2+3总量（市场法）", "15,715,127", "tCO₂e"],
  ["范围1+2排放强度", "37.8", "tCO₂e / MWh"], ["报告年度", "2024", "已披露并鉴证"],
];

const resultSourceRows = [
  ["宁德时代2024年度可持续发展报告", "2025-04-14", "可持续发展报告", "深圳证券交易所"],
  ["宁德时代2024年年度报告", "2025-03-15", "年度报告", "深圳证券交易所"],
  ["2024年度温室气体与ESG关键指标鉴证声明", "2025-04-14", "鉴证声明", "宁德时代官网"],
  ["CDP Climate Change 2024 Response", "2024-12-20", "CDP答卷", "CDP"],
];

function CarbonBenchmarkResult({ followed, onFollowChange }) {
  const [panel, setPanel] = useState(null);
  const [followGoals, setFollowGoals] = useState(["排放表现"]);
  const [visibleRows, setVisibleRows] = useState(1);
  const totalStreamRows = resultEnterpriseInfo.length + carbonDataSummary.length;
  useEffect(() => {
    const timer = window.setInterval(() => setVisibleRows((count) => {
      if (count >= totalStreamRows) { window.clearInterval(timer); return count; }
      return count + 1;
    }), 90);
    return () => window.clearInterval(timer);
  }, [totalStreamRows]);
  function toggleGoal(goal) { setFollowGoals((items) => items.includes(goal) ? items.filter((item) => item !== goal) : [...items, goal]); }
  return <div className="benchmark-result">
    <div className="mcp-status"><span><IconDatabase size={16} /></span><div><strong>已调用 MCP：企业碳数据查询 <IconCircleCheck size={15} /></strong><small>已完成企业主体、可持续发展报告及行业数据库查询</small></div></div>
    <p className="benchmark-intro">已完成查询。以下是宁德时代近三年范围1、2排放情况及与动力电池行业的对比结果：</p>
    <section className="result-enterprise-card">
      <header><div><span><IconBuilding size={19} /></span><div><small>企业基础信息</small><h2>宁德时代新能源科技股份有限公司</h2><p>300750.SZ / 3750.HK · 动力电池 · 福建宁德</p></div></div><div className="benchmark-company-actions"><button className={followed ? "followed" : ""} onClick={() => setPanel("follow")}>{followed ? <IconCircleCheck size={17} /> : <IconSparkles size={17} />}{followed ? "已关注" : "关注企业"}</button></div></header>
      <div className="result-data-table enterprise-table"><div className="result-data-row head"><strong>项目</strong><strong>内容</strong></div>{resultEnterpriseInfo.slice(0, visibleRows).map(([label, value]) => <div className="result-data-row stream-row" key={label}><span>{label}</span><span>{value}</span></div>)}</div>
      {visibleRows >= resultEnterpriseInfo.length && <div className="result-business-scope stream-row"><strong>经营范围</strong><p>锂离子电池、锂聚合物电池、燃料电池、动力电池、超大容量储能电池、超级电容器、电池管理系统及可充电电池包的开发、生产和销售；新能源及储能系统相关技术服务、技术开发、技术咨询与技术转让。</p></div>}
    </section>
    <section className="carbon-data-card"><header><div><IconCloud size={20} /><div><h3>碳排放信息</h3><p>2024年度企业公开披露数据，范围2分别保留市场法和位置法口径</p></div></div></header><div className="result-data-table carbon-table"><div className="result-data-row head"><strong>指标</strong><strong>数值</strong><strong>单位及口径</strong></div>{carbonDataSummary.slice(0, Math.max(0, visibleRows - resultEnterpriseInfo.length)).map(([label, value, unit]) => <div className="result-data-row stream-row" key={label}><span>{label}</span><strong>{value}</strong><span>{unit}</span></div>)}</div>{visibleRows < totalStreamRows && <div className="result-streaming"><IconLoader2 className="spin" size={14} />正在读取并生成企业碳数据…</div>}</section>
    {visibleRows >= totalStreamRows && <section className="result-sources-card stream-row"><header><div><IconFileDescription size={20} /><div><h3>数据来源</h3><p>本次回答引用的企业公开报告与外部披露文件</p></div></div><span>{resultSourceRows.length} 份报告</span></header><div className="source-result-table"><div className="source-result-row head"><strong>标题</strong><strong>发布时间</strong><strong>类型</strong><strong>来源</strong></div>{resultSourceRows.map(([title, date, type, source]) => <div className="source-result-row" key={title}><button type="button">{title}</button><span>{date}</span><span>{type}</span><span>{source}</span></div>)}</div></section>}
    {panel === "follow" && <div className="benchmark-modal-backdrop" onClick={() => setPanel(null)}><section className="benchmark-modal" onClick={(event) => event.stopPropagation()}><header><div><span>关注设置</span><h3>选择关注宁德时代的目的</h3></div><button onClick={() => setPanel(null)} aria-label="关闭"><IconX size={19} /></button></header><div className="follow-config"><p>关注目的将决定后续优先展示的指标和预警内容。</p><div>{["排放表现", "减排目标", "供应商管理", "合规风险"].map((goal) => <button key={goal} className={followGoals.includes(goal) ? "selected" : ""} onClick={() => toggleGoal(goal)}>{followGoals.includes(goal) && <IconCircleCheck size={15} />}{goal}</button>)}</div><footer><button className="cancel" onClick={() => { onFollowChange(false); setPanel(null); }}>取消关注</button><button disabled={!followGoals.length} onClick={() => { onFollowChange(true); setPanel(null); }}>保存关注设置</button></footer></div></section></div>}
  </div>;
}

const enterpriseCandidates = [
  { id: "catl", name: "宁德时代新能源科技股份有限公司", tags: ["上市公司", "高新技术企业", "动力电池"], bondType: "A股 / H股", bondCode: "300750.SZ / 3750.HK" },
  { id: "ningde-new-energy", name: "宁德新能源科技有限公司", tags: ["非上市", "锂离子电池", "外商投资"], bondType: "非上市", bondCode: "—" },
];

function EnterpriseCandidateList({ selected, onSelect, onConfirm }) {
  return <section className="enterprise-candidate-card">
    <div className="mcp-status"><span><IconDatabase size={16} /></span><div><strong>企业碳数据查询 MCP 已返回 2 个企业 <IconCircleCheck size={15} /></strong><small>企业已按工商身份去重，请确认你要查询的企业</small></div></div>
    <header><div><span>企业识别</span><h2>请选择你要查询的企业</h2></div><small>按企业名称、信用代码、行业与证券信息识别</small></header>
    <div className="enterprise-candidate-list">{enterpriseCandidates.map((item, index) => {
      const isSelected = selected === item.id;
      return <button type="button" key={item.id} className={isSelected ? "selected" : ""} onClick={() => onSelect(item.id)}>
        <i>{isSelected ? <IconCircleCheck size={18} /> : <span>{index + 1}</span>}</i>
        <div className="candidate-main"><strong>{item.name}</strong><div className="candidate-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <dl className="candidate-summary"><div><dt>股票类型</dt><dd>{item.bondType}</dd></div><div><dt>股票代码</dt><dd>{item.bondCode}</dd></div></dl>
        </div>
      </button>;
    })}</div>
    <footer><span><IconShieldCheck size={16} />确认后将结合企业碳指标与披露证据回答</span><button type="button" onClick={onConfirm} disabled={!selected}>确认企业并查询碳数据 <IconArrowRight size={16} /></button></footer>
  </section>;
}

function ChatView({ onOpenDetail, followed, onFollowChange }) {
  const exampleQuery = "查询宁德时代近三年范围1、2排放，并与动力电池行业对比";
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("idle");
  const [selectedEnterprise, setSelectedEnterprise] = useState("catl");
  function submit(event) { event.preventDefault(); if (!input.trim() || stage === "searching" || stage === "answering") return; setQuery(input.trim()); setStage("searching"); window.setTimeout(() => setStage("candidates"), 900); }
  function confirmEnterprise() { setStage("answering"); window.setTimeout(() => setStage("result"), 850); }
  function resetConversation() { setInput(""); setQuery(""); setSelectedEnterprise("catl"); setStage("idle"); }
  const busy = stage === "searching" || stage === "answering";
  return <main className="benchmark-workspace">
    <header className="benchmark-header"><div><h1>对话即工作台</h1><p>从问题到洞察，让企业碳数据触手可及</p></div>{stage !== "idle" && <button className="benchmark-reset" onClick={resetConversation}>新建查询</button>}<span>2026-09-19&nbsp;&nbsp; 星期六</span><IconUserCircle size={32} /></header>
    <div className="benchmark-body">
      {stage === "idle" ? <section className="benchmark-welcome"><span><IconSparkles size={28} /></span><h2>想了解哪家企业的碳数据？</h2><p>你可以查询企业排放、减排目标、碳画像，或与同行企业进行对比。</p><button onClick={() => setInput(exampleQuery)}>{exampleQuery}</button></section> : <><div className="benchmark-question"><IconUserCircle size={35} /><p>{query}</p><time>2026-09-19 10:24</time></div><div className="benchmark-agent single"><div className="benchmark-agent-main"><span className="benchmark-agent-mark"><IconSparkles size={19} /></span>{stage === "searching" && <div className="benchmark-loading"><IconLoader2 className="spin" size={21} /><div><strong>正在调用企业碳数据查询 MCP…</strong><small>识别企业工商主体，并查询对应的碳指标与披露记录</small></div></div>}{stage === "candidates" && <EnterpriseCandidateList selected={selectedEnterprise} onSelect={setSelectedEnterprise} onConfirm={confirmEnterprise} />}{stage === "answering" && <div className="benchmark-loading"><IconLoader2 className="spin" size={21} /><div><strong>已确认企业，正在生成回答…</strong><small>结合原问题读取企业信息、排放事实、行业基准与证据来源</small></div></div>}{stage === "result" && <CarbonBenchmarkResult followed={followed} onFollowChange={onFollowChange} />}</div></div></>}
    </div>
    <form className="benchmark-composer" onSubmit={submit}><IconPaperclip size={20} /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入企业名称或碳数据问题…" aria-label="向 Carbon Agent 提问" disabled={busy} /><button disabled={!input.trim() || busy}>{busy ? <IconLoader2 className="spin" size={18} /> : <IconSend2 size={18} />}</button></form>
  </main>;
}

const comparisonMetrics = [
  { group: "碳排放量", label: "碳排放量（范围一）", unit: "tCO₂e", median: 1210000, values: { catl: 587834, byd: 824120, longi: 246900, huaneng: 8920000, midea: 412600, baosteel: 6830000 } },
  { label: "碳排放量（范围二）-市场法", unit: "tCO₂e", median: 5860000, values: { catl: 2281093, byd: 3460280, longi: 2106400, huaneng: 1912000, midea: 1115400, baosteel: 1515000 } },
  { label: "碳排放量（范围二）-地理法/位置法", unit: "tCO₂e", median: 6240000, values: { catl: 3045610, byd: 3986200, longi: 2396800, huaneng: 2218000, midea: 1378900, baosteel: 1872000 } },
  { label: "碳排放量（范围二）-核算口径未披露", unit: "tCO₂e", median: null, values: {} },
  { label: "碳排放量（范围三）", unit: "tCO₂e", median: 14650000, values: { catl: 12846200, byd: 15932600, longi: 9420000, huaneng: 10240000, midea: 7630000, baosteel: 23100000 } },
  { label: "碳排放总量（范围一、二）-市场法", unit: "tCO₂e", median: 7070000, values: { catl: 2868927, byd: 4284400, longi: 2353300, huaneng: 10832000, midea: 1528000, baosteel: 8345000 } },
  { label: "碳排放总量（范围一、二）-地理法/位置法", unit: "tCO₂e", median: 7450000, values: { catl: 3633444, byd: 4810320, longi: 2643700, huaneng: 11138000, midea: 1791500, baosteel: 8702000 } },
  { label: "碳排放总量（范围一、二、三）-市场法", unit: "tCO₂e", median: 21720000, values: { catl: 15715127, byd: 20217000, longi: 11773300, huaneng: 21072000, midea: 9158000, baosteel: 31445000 } },
  { group: "碳排放强度", label: "单位营收碳排放量（范围一）", unit: "tCO₂e/百万元", median: 2.4, decimals: 2, values: { catl: 1.62, byd: 1.09, longi: 1.91, huaneng: 37.4, midea: .55, baosteel: 18.2 } },
  { label: "单位营收碳排放量（范围二）-市场法", unit: "tCO₂e/百万元", median: 8.9, decimals: 2, values: { catl: 6.3, byd: 4.57, longi: 16.3, huaneng: 8.02, midea: 1.49, baosteel: 4.04 } },
  { label: "单位营收碳排放量（范围二）-地理法/位置法", unit: "tCO₂e/百万元", median: 9.6, decimals: 2, values: { catl: 8.41, byd: 5.27, longi: 18.55, huaneng: 9.31, midea: 1.84, baosteel: 4.99 } },
  { label: "单位营收碳排放量（范围三）", unit: "tCO₂e/百万元", median: 24.8, decimals: 2, values: { catl: 35.49, byd: 21.07, longi: 72.9, huaneng: 42.9, midea: 10.18, baosteel: 61.6 } },
  { label: "单位营收碳排放量（范围一、二）-市场法", unit: "tCO₂e/百万元", median: 11.3, decimals: 2, values: { catl: 7.92, byd: 5.66, longi: 18.21, huaneng: 45.42, midea: 2.04, baosteel: 22.24 } },
  { label: "单位营收碳排放量（范围一、二、三）-市场法", unit: "tCO₂e/百万元", median: 36.1, decimals: 2, values: { catl: 43.41, byd: 26.73, longi: 91.11, huaneng: 88.32, midea: 12.22, baosteel: 83.84 } },
];

const comparisonYears = ["2024", "2023", "2022"];
function comparisonValue(metric, companyId, year) {
  const fallbackFactor = { zijin: 1.35, baosteel: 1.18, midea: .72 }[companyId] || 1;
  const value = metric.values[companyId] ?? (metric.median === null ? undefined : metric.median * fallbackFactor);
  if (value === undefined) return "—";
  const factor = year === "2024" ? 1 : year === "2023" ? 1.075 : 1.15;
  const calculated = value * factor;
  return metric.decimals !== undefined ? calculated.toFixed(metric.decimals) : Math.round(calculated).toLocaleString();
}
function comparisonMedian(metric, year) {
  if (metric.median === null) return "—";
  const factor = year === "2024" ? 1 : year === "2023" ? 1.06 : 1.12;
  const value = metric.median * factor;
  return metric.decimals !== undefined ? value.toFixed(metric.decimals) : Math.round(value).toLocaleString();
}

function CompanyListView({ followedCompanies, onOpenDetail, onFollowChange }) {
  const [page, setPage] = useState("list");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showMedian, setShowMedian] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [year, setYear] = useState("2024");
  const [trendMetric, setTrendMetric] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(false);
  const [showAddCompanies, setShowAddCompanies] = useState(false);
  const [draftFollowIds, setDraftFollowIds] = useState([]);
  const [addCompanyQuery, setAddCompanyQuery] = useState("");
  const filtered = followedCompanies.filter((company) => company.name.includes(query) || company.industry.includes(query) || company.code.toLowerCase().includes(query.toLowerCase()));
  const selected = followedCompanies.filter((company) => selectedIds.includes(company.id));
  function toggleCompany(id) { setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : ids.length < 4 ? [...ids, id] : ids); }
  function startSelection() { setSelectedIds([]); setPage("select"); }
  function openComparison() { if (selectedIds.length >= 2) { setAiAnalysis(false); setPage("compare"); } }
  function openAddCompanies() { setDraftFollowIds(followedCompanies.map((company) => company.id)); setAddCompanyQuery(""); setShowAddCompanies(true); }
  function toggleFollowDraft(id) { setDraftFollowIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : ids.length < 12 ? [...ids, id] : ids); }
  const addCompanyResults = addCompanyQuery.trim() ? companies.filter((company) => `${company.name} ${company.short} ${company.code} ${company.industry}`.toLowerCase().includes(addCompanyQuery.trim().toLowerCase())) : [];

  if (page === "compare") return <main className="followed-workspace compare-detail-page">
    <header className="compare-detail-header"><button onClick={() => setPage("list")}><IconArrowLeft size={17} />返回企业列表</button><div><span>ENTERPRISE COMPARISON</span><h1>企业碳数据对比</h1><p>{selected.map((company) => company.name).join(" · ")}</p></div><div><button onClick={() => setAiAnalysis(true)}><IconSparkles size={16} />AI分析结果</button></div></header>
    <div className="compare-detail-body">{aiAnalysis && <section className="ai-compare-analysis"><header><IconSparkles size={19} /><div><span>AI 对比分析</span><strong>基于所选企业及行业中位数生成</strong></div><button onClick={() => setAiAnalysis(false)}><IconX size={16} /></button></header><div><article><b>01</b><p><strong>排放规模</strong>{selected[0]?.short}的范围1+2排放低于所选企业平均值，绝对排放表现相对较优。</p></article><article><b>02</b><p><strong>排放效率</strong>企业间强度口径存在差异，当前结果适合识别趋势，不建议直接用于绩效排名。</p></article><article><b>03</b><p><strong>重点关注</strong>建议继续核对范围3披露完整度、组织边界及绿电权益注销记录。</p></article></div></section>}<section className="comparison-board detail"><header><div><span>横向数据对比</span><h2>{selected.length} 家企业 · {year}年度</h2></div><div className="comparison-controls"><select value={year} onChange={(event) => setYear(event.target.value)}>{comparisonYears.map((item) => <option key={item}>{item}</option>)}</select><label><input type="checkbox" checked={showMedian} onChange={(event) => setShowMedian(event.target.checked)} />显示行业中位数</label></div></header><div className="comparison-scroll"><div className="comparison-matrix" style={{ "--compare-columns": selected.length + (showMedian ? 1 : 0) }}><div className="comparison-row head"><strong>指标</strong>{selected.map((company) => <strong key={company.id}>{company.short}<small>{company.code}</small></strong>)}{showMedian && <strong className="median-column">行业中位数<small>{year}年</small></strong>}</div>{comparisonMetrics.map((metric) => <Fragment key={metric.label}>{metric.group && <div className="comparison-group-row"><strong>{metric.group}</strong></div>}<div className="comparison-row"><span><b>{metric.label}<button className="metric-trend-button" onClick={() => setTrendMetric(metric)} aria-label={`查看${metric.label}趋势`}><IconChartLine size={15} /></button></b><small>{metric.unit}</small></span>{selected.map((company) => <span key={company.id}>{comparisonValue(metric, company.id, year)}</span>)}{showMedian && <span className="median-column">{comparisonMedian(metric, year)}</span>}</div></Fragment>)}</div></div></section>
    </div>
    {trendMetric && <div className="benchmark-modal-backdrop" onClick={() => setTrendMetric(null)}><section className="benchmark-modal metric-trend-modal" onClick={(event) => event.stopPropagation()}><header><div><span>指标趋势</span><h3>{trendMetric.label}</h3></div><button onClick={() => setTrendMetric(null)}><IconX size={18} /></button></header><div className="trend-chart"><div className="trend-axis"><span>{trendMetric.unit}</span><span>同比变化</span></div><div className="trend-plot">{["2020","2021","2022","2023","2024"].map((trendYear, index) => { const base = trendMetric.values[selected[0]?.id] || trendMetric.median || 1; const heights = [64,48,55,60,52]; return <div className="trend-point" key={trendYear}><i style={{ height: `${heights[index]}%` }} /><b style={{ bottom: `${[70,35,46,63,56][index]}%` }} /><span>{trendYear}</span><small>{Math.round(base * [1.28,1.16,1.15,1.075,1][index]).toLocaleString()}</small></div>; })}<svg viewBox="0 0 500 170" preserveAspectRatio="none"><polyline points="50,42 150,110 250,88 350,54 450,68" /></svg></div><div className="trend-legend"><span><i />{selected[0]?.short || "企业"}指标值</span><span><i />同比变化</span></div></div></section></div>}
  </main>;

  return <main className="followed-workspace"><header className="followed-header"><div><span>FOLLOWED ENTERPRISES</span><h1>{page === "select" ? "选择对比企业" : "关注的企业"}</h1><p>{page === "select" ? "请选择2–4家企业，确认后进入独立的对比详情页面。" : "集中查看已关注企业，并从企业列表发起横向对比。"}</p></div>{page === "list" && <div className="followed-header-actions"><button className="header-add-action" onClick={openAddCompanies}><IconPlus size={17} />添加企业</button><button className="header-compare-action" onClick={startSelection}><IconChartBar size={17} />企业对比</button></div>}</header>
    <div className="followed-body"><section className="followed-list-toolbar"><div className="knowledge-search"><IconSearch size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索企业名称、证券代码或行业" /></div><div>{page === "select" ? <><span>已选择 {selected.length} / 4 家</span><button onClick={() => setPage("list")}>取消</button><button disabled={selected.length < 2} onClick={openComparison}>确认并开始对比 <IconArrowRight size={15} /></button></> : <><span>共 {filtered.length} 家</span><div className="view-toggle"><button className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")}><IconLayoutGrid size={15} /></button><button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}><IconListDetails size={15} /></button></div></>}</div></section>
      {filtered.length ? viewMode === "cards" && page === "list" ? <section className="followed-card-grid">{filtered.map((company) => <article key={company.id} onClick={() => onOpenDetail(company)}><header><i>{company.short.slice(0,1)}</i><div><strong>{company.name}</strong><small>{company.code}</small></div></header><div><span>{company.industry}</span><span>{company.city}</span></div><footer><span>更新于 {company.updated}</span><button className="card-more-action" aria-label={`取消关注${company.name}`} onClick={(event) => { event.stopPropagation(); onFollowChange(followedCompanies.filter((item) => item.id !== company.id).map((item) => item.id)); }}><IconDots size={19} /><em>取消关注</em></button></footer></article>)}</section> : <section className={`followed-enterprise-list ${page === "select" ? "selection-mode" : ""}`}><div className="head"><span>企业</span><span>行业与地区</span><span>最新碳数据</span><span>碳目标</span><span /></div>{filtered.map((company) => { const checked = selectedIds.includes(company.id); return <article className={checked ? "selected" : ""} key={company.id}>{page === "select" && <button className="follow-check" onClick={() => toggleCompany(company.id)}>{checked ? <IconCircleCheck size={18} /> : <span />}</button>}<div className="followed-company-name"><i>{company.short.slice(0,1)}</i><div><strong>{company.name}</strong><small>{company.code}</small></div></div><span>{company.industry}<small>{company.city}</small></span><span><strong>{company.scope12}</strong><small>范围1+2</small></span><span><strong>{company.target}</strong><small>最新承诺</small></span>{page === "select" ? <button className="select-row-hit" onClick={() => toggleCompany(company.id)} aria-label={`选择${company.name}`} /> : <button className="open-company" onClick={() => onOpenDetail(company)}>查看档案 <IconChevronRight size={14} /></button>}</article>; })}</section> : <section className="followed-empty"><IconBuilding size={28} /><strong>还没有关注企业</strong><p>在对话查询结果中点击“关注企业”，企业会自动出现在这里。</p></section>}
    </div>
    {showAddCompanies && <div className="benchmark-modal-backdrop" onClick={() => setShowAddCompanies(false)}><section className="benchmark-modal add-company-modal" onClick={(event) => event.stopPropagation()}><header><div><span>关注企业</span><h3>查找并添加企业</h3><p>支持同时关注 10+ 家企业，当前上限 12 家</p></div><button onClick={() => setShowAddCompanies(false)}><IconX size={18} /></button></header><div className="add-company-search"><IconSearch size={19} /><input autoFocus value={addCompanyQuery} onChange={(event) => setAddCompanyQuery(event.target.value)} placeholder="输入企业名称、证券代码或行业" />{addCompanyQuery && <button onClick={() => setAddCompanyQuery("")}><IconX size={15} /></button>}</div><div className="add-company-results">{!addCompanyQuery.trim() ? <div className="add-company-empty"><IconSearch size={28} /><strong>查找要关注的企业</strong><p>输入企业名称、证券代码或行业关键词后添加。</p></div> : addCompanyResults.length ? addCompanyResults.map((company) => { const checked = draftFollowIds.includes(company.id); return <article className={checked ? "selected" : ""} key={company.id}><i>{company.short.slice(0,1)}</i><span><strong>{company.name}</strong><small>{company.code} · {company.industry} · {company.city}</small></span><button disabled={checked || draftFollowIds.length >= 12} onClick={() => toggleFollowDraft(company.id)}>{checked ? <><IconCircleCheck size={15} />已关注</> : <><IconPlus size={15} />添加</>}</button></article>; }) : <div className="add-company-empty"><IconBuilding size={28} /><strong>未找到匹配企业</strong><p>请尝试企业全称、证券代码或其他行业关键词。</p></div>}</div><footer><span>已关注 {draftFollowIds.length} / 12 家</span><div><button onClick={() => setShowAddCompanies(false)}>取消</button><button className="primary" onClick={() => { onFollowChange(draftFollowIds); setShowAddCompanies(false); }}>确认</button></div></footer></section></div>}
  </main>;
}

function SourceFileLibrary({ id = "source-files", embedded = false }) {
  const [year, setYear] = useState("全部年份");
  const [type, setType] = useState("全部类型");
  const years = ["全部年份", ...new Set(sourceFiles.map((file) => file.year))];
  const types = ["全部类型", ...new Set(sourceFiles.map((file) => file.type))];
  const filtered = sourceFiles.filter((file) => (year === "全部年份" || file.year === year) && (type === "全部类型" || file.type === type));
  return <section className={`source-library ${embedded ? "embedded-source-library" : ""}`} id={id}>
    <div className="dimension-heading"><div><span className="phase-badge">{embedded ? "基础闭环 · 02" : "源文件中心"}</span><h2>{embedded ? "披露与证据" : "企业披露源文件"}</h2><p>企业披露的全部源文件按年份和类型归档；每份文件保留版本、解析状态、页数和证据片段。</p></div><strong>{filtered.length} / {sourceFiles.length} 份</strong></div>
    <div className="source-filters"><div><span>年份</span>{years.map((item) => <button className={year === item ? "active" : ""} key={item} onClick={() => setYear(item)}>{item}</button>)}</div><div><span>类型</span>{types.map((item) => <button className={type === item ? "active" : ""} key={item} onClick={() => setType(item)}>{item}</button>)}</div></div>
    <div className="source-file-grid">{filtered.map((file) => <button className="source-file-card" key={`${file.year}-${file.title}`}><div className="file-icon"><IconFileDescription size={21} /></div><div><span>{file.year} · {file.type}</span><strong>{file.title}</strong><small>{file.pages} 页 · {file.evidence} 个证据片段</small></div><em><IconCircleCheck size={14} />{file.status}</em><IconChevronRight size={17} /></button>)}</div>
    {!filtered.length && <div className="source-empty">当前筛选条件下暂无源文件</div>}
  </section>;
}

function DimensionSection({ dimension, index }) {
  return <section className="field-dimension" id={`dimension-${index}`}>
    <div className="dimension-heading"><div><span className="phase-badge">{dimension.phase} · {String(index + 1).padStart(2, "0")}</span><h2>{dimension.name}</h2><p>{dimension.desc}</p></div><strong>{dimension.fields.length} 个字段</strong></div>
    <div className="dimension-form-grid">{dimension.fields.map((field, fieldIndex) => { const record = getFieldRecord(field, fieldIndex); return <div className="dimension-form-field" key={field}><label>{field}</label><div><strong>{record.value}</strong><span>报告期 {record.period}</span></div></div>; })}</div>
  </section>;
}

const enterpriseSubjectGroups = [
  { title: "主体标识与登记", note: "稳定识别单一法人实体；外部工商字段与报告提取字段分源维护。", fields: ["企业唯一ID","中文全称","英文全称","常用简称","曾用名","统一社会信用代码","LEI全球法人识别码","企业类型","存续状态","注册国家/地区","公司法律形式","成立日期","注册地址","注册办事处","总部地址","主要营业地点","法定代表人","行业分类","公司网站","联系部门","联系电话","联系邮箱"] },
  { title: "业务与经营规模", note: "保留报告原文及标准化口径，为排放强度、同业对标和集团边界判断提供分母。", fields: ["主营业务原文","品牌与业务板块","主要产品和服务","主要经营国家/地区","主要市场","生产基地/运营设施","员工总数","营业收入","收入币种","收入数量级"] },
  { title: "上市与证券信息", note: "一个法人可对应多个上市市场和证券代码，证券记录按数组保存。", fields: ["上市状态","证券简称","上市地点与证券代码"] },
  { title: "集团关系与碳核算边界", note: "母子关系、并表关系、披露主体和实际核算对象分别建模并保留有效期。", fields: ["直属母公司ID","最终母公司ID","集团关系路径","直接持股比例","关系有效期","实际控制人/最终受益人","并表状态","合并方法","披露主体身份","碳核算对象类型","碳核算/报告边界","关联实体清单","并购剥离与关系变更"] },
];

const structuredDimensionGroups = {
  "排放核算": [
    { title: "核算对象与数据时间", note: "一条排放事实必须同时绑定企业、源报告、数据年度、法人/设施和集团汇总层级。", fields: ["核算记录ID","核算主体ID","核算主体名称","源报告ID","报告年度","数据期开始日","数据期结束日","数据年度","核算层级","核算法人实体","核算设施","经营地区","纳入法人实体清单","纳入设施清单","合并方法"] },
    { title: "核算方法、边界与参数", note: "标准、组织边界、GWP和排放因子必须保存具体版本，未说明不能自行补齐。", fields: ["组织边界方法","运营边界说明","核算标准","活动数据方法","支出法说明","计算公式原文","排放因子来源","排放因子年份","排放因子地区","排放因子数值","排放因子单位","GWP来源","GWP评估报告版本","温室气体覆盖种类","Scope 1排放源说明","Scope 2排放源说明","Scope 3排放源说明"] },
    { title: "年度排放汇总", note: "保留地点法、市场法、未分Scope总量及各类合计，不能依据能源数据擅自拆分。", fields: ["Scope 1排放","Scope 2地点法","Scope 2市场法","Scope 2计算方法","Scope 3总量","Scope 3十五类别","Scope 3核算边界","未分Scope排放总量","Scope 1+2合计","Scope 1+2+3合计","生物源排放","温室气体移除量","抵消与碳信用使用"] },
    { title: "排放指标事实", note: "原始值、标准化值和数据状态同时保存；N/A、破折号和未披露均不能转成0。", fields: ["指标代码","指标名称原文","排放范围","指标形态","Scope 3类别编号","Scope 3类别名称原文","本期原始值","标准化数值","原始单位","标准单位","数据状态","是否CO₂当量","上期数值","变动值","变动比例","排除项说明","估算说明","数据脚注"] },
    { title: "排放强度口径", note: "强度必须绑定分子Scope、分母类型、币种和数量级；不同口径不能直接排名。", fields: ["强度对应排放范围","排放强度值","强度原始单位","强度标准单位","强度分母类型","强度分母名称原文","强度分母数值","强度分母单位","强度分母币种","上期排放强度"] },
    { title: "排放源与活动数据", note: "支持从年度结果下钻到燃料、能源、活动数据、排放因子和计算结果。", fields: ["排放源所属Scope","排放源类别","排放源名称原文","燃料类型","能源类型","活动数据值","活动数据单位","计算排放量","计算排放单位","是否计入总量","排放源排除原因"] },
    { title: "质量、重述与鉴证", note: "鉴证状态、范围和结论分开保存，避免把局部鉴证泛化到全部排放。", fields: ["重述与历史调整","数据质量说明","结果不确定性","估算数据标识","鉴证状态","鉴证机构","鉴证范围","鉴证结论"] },
  ],
  "目标与承诺": [
    { title: "目标身份与适用范围", note: "每个目标是独立记录，并绑定责任主体、适用层级和覆盖实体。", fields: ["目标唯一ID","目标名称","目标责任主体ID","目标适用层级","目标覆盖实体清单","目标类型","目标状态","承诺发布日期"] },
    { title: "基准、边界与目标值", note: "基准值、目标值、覆盖范围和范围3类别必须使用同一口径。", fields: ["基准年","基准排放量","目标年","目标值","减排比例","绝对量/强度目标","目标覆盖范围","覆盖的Scope 3类别","覆盖排放比例"] },
    { title: "承诺与外部验证", note: "区分碳达峰、近期减排、长期净零和可再生能源倡议。", fields: ["碳达峰目标","近期减排目标","长期减排目标","碳中和/净零目标","SBTi状态","RE100/EV100等倡议","碳抵消依赖","残余排放与中和方案"] },
    { title: "进度与治理", note: "保存最新进度、计算方法、责任人和历次目标变更。", fields: ["最新进度年度","目标进度","进度核算方法","目标治理责任人","目标变更时间线"] },
  ],
};

function EnterpriseSubjectSection({ dimension, company, index }) {
  const groupTree = company.id === "catl" ? [
    ["宁德时代新能源科技股份有限公司", "最终母公司 · 上市/披露主体"],
    ["宁德时代新能源产业投资有限公司", "直属子公司 · 纳入并表"],
    ["四川时代新能源科技有限公司", "孙公司 · 独立碳核算对象"],
    ["时代一汽动力电池有限公司", "合营/子公司 · 独立法人"],
    ["德国时代新能源科技（图林根）有限公司", "境外子公司 · 生产设施"],
  ] : [[company.name, "最终母公司 · 披露主体"], [`${company.short}核心制造子公司`, "直属子公司 · 独立核算对象"], [`${company.short}区域运营公司`, "境内子公司 · 纳入并表"], [`${company.short}海外业务主体`, "境外子公司 · 独立法人"]];
  return <section className="field-dimension enterprise-subject" id={`dimension-${index}`}>
    <div className="dimension-heading"><div><span className="phase-badge">{dimension.phase} · 01</span><h2>{dimension.name}</h2><p>{dimension.desc}</p></div><strong>{dimension.fields.length} 个字段</strong></div>
    <div className="entity-model-note"><IconNetwork size={20} /><div><strong>实体与关系分开建模</strong><span>每个集团成员都是独立企业实体；母子公司、持股、并表和核算边界作为带有效期的关系记录保存。</span></div></div>
    <div className="group-tree-panel"><header><div><span>集团层级示例</span><strong>{company.short} 集团实体树</strong></div><em>集团 → 法人 → 核算对象/设施</em></header><div className="group-tree-list">{groupTree.map(([name, role], treeIndex) => <div className={`tree-node level-${treeIndex === 0 ? 0 : treeIndex === 2 ? 2 : 1}`} key={name}><i>{treeIndex === 0 ? "集团" : treeIndex === 2 ? "孙" : "子"}</i><div><strong>{name}</strong><span>{role}</span></div></div>)}</div></div>
    {enterpriseSubjectGroups.map((group) => <section className="subject-field-group" key={group.title}><header><div><strong>{group.title}</strong><span>{group.note}</span></div><em>{group.fields.length} 个字段</em></header><div className="dimension-form-grid">{group.fields.map((field, fieldIndex) => { const record = getFieldRecord(field, fieldIndex); return <div className="dimension-form-field" key={field}><label>{field}</label><div><strong>{record.value}</strong><span>报告期 {record.period}</span></div></div>; })}</div></section>)}
  </section>;
}

const emissionYearOverrides = {
  "2024": {},
  "2023": { "核算记录ID":"GHG-CATL-GROUP-2023", "源报告ID":"REPORT-CATL-ESG-2023", "报告年度":"2023", "数据期开始日":"2023-01-01", "数据期结束日":"2023-12-31", "数据年度":"2023", "排放因子年份":"2023或报告采用的最近可得版本", "Scope 1排放":"639,210 tCO₂e", "Scope 2地点法":"3,286,440 tCO₂e", "Scope 2市场法":"2,472,860 tCO₂e", "Scope 3十五类别":"已披露9/15类", "Scope 1+2合计":"3,112,070 tCO₂e（市场法）", "数据质量说明":"范围1+2以实测为主；范围3估算数据占比较高", "本期原始值":"639,210", "标准化数值":"639210", "变动比例":"较2022年下降9.0%" },
  "2022": { "核算记录ID":"GHG-CATL-GROUP-2022", "源报告ID":"REPORT-CATL-ESG-2022", "报告年度":"2022", "数据期开始日":"2022-01-01", "数据期结束日":"2022-12-31", "数据年度":"2022", "排放因子年份":"2022或报告采用的最近可得版本", "Scope 1排放":"702,418 tCO₂e", "Scope 2地点法":"3,502,118 tCO₂e", "Scope 2市场法":"2,618,906 tCO₂e", "Scope 3十五类别":"已披露8/15类", "Scope 1+2合计":"3,321,324 tCO₂e（市场法）", "数据质量说明":"基准年数据；边界变更后需保留原值和重述值", "本期原始值":"702,418", "标准化数值":"702418", "变动比例":"基准年" },
};

const targetCycleOverrides = {
  "全部周期": {},
  "近期（至2030）": { "目标唯一ID":"TARGET-CATL-SBT-2030", "目标名称":"SBTi近期减排目标", "目标年":"2030", "目标类型":"近期绝对量减排", "目标值":"按SBTi验证路径降低范围1、2及重点范围3排放", "目标状态":"进行中", "碳中和/净零目标":"不适用本周期", "最新进度年度":"2024" },
  "中期（2031–2040）": { "目标唯一ID":"TARGET-CATL-NZ-2035", "目标名称":"核心运营碳中和目标", "目标年":"2035", "目标类型":"核心运营碳中和", "目标值":"核心运营净排放降至零", "目标状态":"进行中", "近期减排目标":"作为2035目标的前置路径", "最新进度年度":"2024" },
  "长期（2041以后）": { "目标唯一ID":"TARGET-CATL-VC-LT", "目标名称":"全价值链长期低碳转型", "目标年":"2050及以后", "目标类型":"长期价值链深度减排", "目标值":"覆盖重点范围3类别与供应链伙伴", "目标状态":"规划中", "碳中和/净零目标":"长期全价值链方向，具体净零年份待进一步披露", "最新进度年度":"2024" },
};

function StructuredDimensionSection({ dimension, index }) {
  const groups = structuredDimensionGroups[dimension.name];
  const isEmission = dimension.name === "排放核算";
  const options = isEmission ? ["2024", "2023", "2022"] : Object.keys(targetCycleOverrides);
  const [period, setPeriod] = useState(options[0]);
  const overrides = isEmission ? emissionYearOverrides[period] : targetCycleOverrides[period];
  return <section className="field-dimension structured-dimension" id={`dimension-${index}`}>
    <div className="dimension-heading"><div><span className="phase-badge">{dimension.phase} · {String(index + 1).padStart(2, "0")}</span><h2>{dimension.name}</h2><p>{dimension.desc}</p></div><strong>{dimension.fields.length} 个字段</strong></div>
    <div className="entity-model-note"><IconRoute size={20} /><div><strong>{dimension.name === "排放核算" ? "先定核算主体，再看排放结果" : "一个承诺对应一条可追踪目标记录"}</strong><span>{dimension.name === "排放核算" ? "集团汇总、子公司核算和设施核查分别保存，通过主体ID和汇总关系关联。" : "集团目标可以拆解给子公司，但子公司目标不能自动等同于集团承诺。"}</span></div></div>
    <div className="dimension-period-switch"><div><span>{isEmission ? "报告年度" : "目标周期"}</span>{options.map((option) => <button className={period === option ? "active" : ""} key={option} onClick={() => setPeriod(option)}>{option}</button>)}</div><em>{isEmission ? `${period} 年集团合并口径` : `${period}目标组合`}</em></div>
    {groups.map((group) => <section className="subject-field-group" key={group.title}><header><div><strong>{group.title}</strong><span>{group.note}</span></div><em>{group.fields.length} 个字段</em></header><div className="dimension-form-grid">{group.fields.map((field, fieldIndex) => { const record = getFieldRecord(field, fieldIndex); const value = overrides[field] || record.value; return <div className="dimension-form-field" key={field}><label>{field}</label><div><strong>{value}</strong><span>{isEmission ? `报告期 ${period}` : `目标周期 ${period}`}</span></div></div>; })}</div></section>)}
  </section>;
}

function CompanyDetailView({ company, onBack }) {
  const [section, setSection] = useState("总览");
  function jumpTo(id, label) { setSection(label); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  return <main className="detail-workspace"><header className="detail-topbar"><button onClick={onBack}><IconArrowLeft size={17} />返回企业列表</button><div><button className="secondary-button"><IconDownload size={16} />导出档案</button><button className="primary-button"><IconSparkles size={16} />向 Agent 提问</button></div></header><div className="detail-scroll"><CompanyIdentity company={company} />
    <div className="detail-layout"><aside className="detail-index"><span>企业碳档案 · 优先级顺序</span><button className={section === "总览" ? "active" : ""} onClick={() => jumpTo("archive-overview", "总览")}><IconLayoutGrid size={16} />总览<IconChevronRight size={15} /></button>{dimensionCatalog.map((item, index) => <button className={section === item.name ? "active" : ""} key={item.name} onClick={() => jumpTo(`dimension-${index}`, item.name)}><b>{String(index + 1).padStart(2, "0")}</b>{item.name}<em>{index === 1 ? sourceFiles.length : item.fields.length}</em></button>)}<div className="quality-box"><IconShieldCheck size={20} /><strong>数据质量 A</strong><span>92% 字段有官方证据</span></div></aside>
      <section className="detail-content"><div className="detail-title" id="archive-overview"><div><span>企业完整碳档案</span><h1>{company.name} · 企业碳档案</h1><p>15 个维度 · {totalFieldCount} 个完整字段 · 数据截至 2026-08-25 10:28</p></div><div className="source-count"><strong>{sourceFiles.length}</strong><span>企业披露源文件</span></div></div><ArchiveOverview company={company} />
        <div className="priority-explainer"><IconRoute size={19} /><div><strong>维度已按建议实施顺序排列</strong><span>基础闭环 → 分析能力 → 场景扩展 → 外围信息；每个维度以字段表单展示最新数据/状态和报告期。</span></div></div>
        <div className="all-dimensions">{dimensionCatalog.map((dimension, index) => index === 0 ? <EnterpriseSubjectSection key={dimension.name} dimension={dimension} company={company} index={index} /> : index === 1 ? <SourceFileLibrary key={dimension.name} id="dimension-1" embedded /> : structuredDimensionGroups[dimension.name] ? <StructuredDimensionSection key={dimension.name} dimension={dimension} index={index} /> : <DimensionSection key={dimension.name} dimension={dimension} index={index} />)}</div>
      </section></div></div>
  </main>;
}

const carbonMetricGroups = [
  {
    name: "碳排放量",
    rows: [
      ["碳排放量（范围一）", "吨CO₂e", "2,854,671.44", "2,401,702.32", "765,338.97", "610,885.46", "303,120.23"],
      ["碳排放量（范围二）", "吨CO₂e", "7,977,357.46", "6,181,750.36", "1,477,835.08", "2,631,947.26", "1,959,621.64"],
      ["碳排放量（范围三）", "吨CO₂e", "111,151,357.75", "112,350,996.78", "—", "—", "—"],
      ["碳排放总量（范围一、二）", "吨CO₂e", "10,832,028.90", "8,583,452.68", "2,243,174.05", "3,242,832.72", "2,262,741.87"],
      ["碳排放总量（范围二、三）", "吨CO₂e", "119,128,715.21", "118,532,747.14", "—", "—", "—"],
      ["碳排放总量（范围一、二、三）", "吨CO₂e", "121,983,386.65", "120,934,449.46", "—", "—", "—"],
    ],
  },
  {
    name: "碳排放强度",
    rows: [
      ["单位营收碳排放量（范围一、二）", "吨CO₂e/百万元", "25.57", "23.71", "5.60", "9.87", "17.87"],
      ["单位营收碳排放量（范围一）", "吨CO₂e/百万元", "6.74", "6.63", "1.91", "1.86", "2.50"],
      ["单位营收碳排放量（范围二）", "吨CO₂e/百万元", "18.83", "17.08", "3.69", "8.01", "15.37"],
      ["单位营收碳排放量（范围三）", "吨CO₂e/百万元", "262.33", "310.35", "—", "—", "—"],
      ["单位营收碳排放量（范围二、三）", "吨CO₂e/百万元", "281.16", "327.43", "—", "—", "—"],
      ["单位营收碳排放量（范围一、二、三）", "吨CO₂e/百万元", "287.90", "334.06", "—", "—", "—"],
    ],
  },
];

const scope3CategoryRows = [
  ["类别1－外购商品和服务", "吨CO₂e", "42,684,315.26", "45,126,884.92", "—", "—", "—"],
  ["类别2－资本商品", "吨CO₂e", "18,526,407.18", "17,892,316.45", "—", "—", "—"],
  ["类别3－燃料和能源相关活动", "吨CO₂e", "12,384,162.73", "12,806,495.21", "—", "—", "—"],
  ["类别4－上游运输和配送", "吨CO₂e", "8,764,238.55", "8,529,641.70", "—", "—", "—"],
  ["类别5－运营中产生的废弃物", "吨CO₂e", "1,284,506.42", "1,315,828.16", "—", "—", "—"],
  ["类别6－商务旅行", "吨CO₂e", "126,835.17", "118,604.35", "—", "—", "—"],
  ["类别7－雇员通勤", "吨CO₂e", "238,516.64", "226,381.91", "—", "—", "—"],
  ["类别8－上游租赁资产", "吨CO₂e", "516,284.03", "498,726.88", "—", "—", "—"],
  ["类别9－售出产品的运输和配送", "吨CO₂e", "3,684,275.62", "3,526,481.24", "—", "—", "—"],
  ["类别10－售出产品的加工", "吨CO₂e", "4,582,316.48", "4,693,705.36", "—", "—", "—"],
  ["类别11－售出产品的使用", "吨CO₂e", "15,826,437.93", "15,435,928.64", "—", "—", "—"],
  ["类别12－处理寿命终止的售出产品", "吨CO₂e", "1,346,825.72", "1,298,406.53", "—", "—", "—"],
  ["类别13－下游租赁资产", "吨CO₂e", "268,410.35", "254,918.76", "—", "—", "—"],
  ["类别14－特许经营权", "吨CO₂e", "483,726.18", "465,307.62", "—", "—", "—"],
  ["类别15－投资", "吨CO₂e", "412,893.49", "161,770.05", "—", "—", "—"],
];

const esgPillars = {
  环境: [
    ["气候变化", "86", "温室气体核算、气候目标及转型计划披露完整"],
    ["能源管理", "82", "可再生能源占比 64.3%，能源效率持续提升"],
    ["资源与循环", "78", "电池材料回收与闭环利用形成规模化能力"],
    ["污染防治", "80", "重点设施排污许可有效，未发现重大处罚"],
  ],
  社会: [
    ["员工发展", "79", "员工培训、安全生产与多元化机制持续完善"],
    ["供应链责任", "76", "CREDIT 价值链计划覆盖约 72% 重点供应商"],
    ["产品责任", "88", "产品安全与数字电池护照准备处于行业前列"],
    ["社区影响", "71", "公益投入与运营所在地社区项目稳定开展"],
  ],
  治理: [
    ["董事会治理", "84", "董事会战略委员会承担可持续发展监督职责"],
    ["商业道德", "81", "反腐败、举报与审计机制覆盖主要经营实体"],
    ["风险管理", "83", "气候与供应链风险纳入企业风险管理体系"],
    ["信息披露", "87", "年度报告、ESG报告及关键指标鉴证可追溯"],
  ],
};

function isQuantitativeMetric(row) {
  return row[1] !== "—" && row.slice(2).some((value) => Number.isFinite(Number(String(value).replaceAll(",", ""))));
}

function MetricTrendCanvas({ row, years }) {
  const series = years.map((year, index) => ({
    year: year.replace("年", ""),
    value: Number(String(row[index + 2]).replaceAll(",", "")),
  })).filter((item) => Number.isFinite(item.value)).reverse();
  const width = 820;
  const plot = { left: 78, right: 770, top: 28, bottom: 218 };
  const maxValue = Math.max(...series.map((item) => item.value)) * 1.16;
  const yoy = series.map((item, index) => index === 0 ? null : ((item.value - series[index - 1].value) / series[index - 1].value) * 100);
  const yoyValues = yoy.filter((value) => value !== null);
  const yoyMin = Math.min(-10, ...yoyValues);
  const yoyMax = Math.max(10, ...yoyValues);
  const step = (plot.right - plot.left) / Math.max(series.length, 1);
  const barWidth = Math.min(42, step * .36);
  const linePoints = yoy.map((value, index) => value === null ? null : `${plot.left + step * index + step / 2},${plot.bottom - ((value - yoyMin) / (yoyMax - yoyMin || 1)) * (plot.bottom - plot.top)}`).filter(Boolean).join(" ");
  return <svg className="metric-trend-canvas" viewBox={`0 0 ${width} 260`} role="img" aria-label={`${row[0]}年度数值与同比变化分析图`}>
    <title>{row[0]}年度数值与同比变化分析图</title>
    {[0,1,2,3,4].map((index) => { const y = plot.top + ((plot.bottom - plot.top) * index) / 4; return <g key={index}><line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="#e8eeec"/><text x={plot.left - 10} y={y + 4} textAnchor="end">{Math.round(maxValue * (1 - index / 4)).toLocaleString("zh-CN")}</text></g>; })}
    {series.map((item, index) => { const x = plot.left + step * index + step / 2; const barHeight = (item.value / maxValue) * (plot.bottom - plot.top); return <g key={item.year}><rect x={x - barWidth / 2} y={plot.bottom - barHeight} width={barWidth} height={barHeight} rx="2" fill="#3787ef"/><text x={x} y={plot.bottom + 23} textAnchor="middle">{item.year}</text></g>; })}
    {linePoints && <polyline points={linePoints} fill="none" stroke="#f0b05c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>}
    {yoy.map((value, index) => { if (value === null) return null; const x = plot.left + step * index + step / 2; const y = plot.bottom - ((value - yoyMin) / (yoyMax - yoyMin || 1)) * (plot.bottom - plot.top); return <g key={`${series[index].year}-yoy`}><circle cx={x} cy={y} r="4" fill="#fff" stroke="#f0b05c" strokeWidth="2"/><text x={x} y={Math.max(18, y - 10)} textAnchor="middle" className="yoy-label">{value.toFixed(1)}%</text></g>; })}
    <text x={plot.left} y="14" textAnchor="start">{row[1]}</text><text x={plot.right} y="14" textAnchor="end">同比变化（%）</text>
  </svg>;
}

function TrendAnalysisModal({ row, years, onClose }) {
  const series = years.map((year, index) => ({ year, value: row[index + 2] })).filter((item) => item.value !== "—");
  const numericSeries = series.map((item) => Number(String(item.value).replaceAll(",", "")));
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return <div className="trend-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="trend-modal" role="dialog" aria-modal="true" aria-labelledby="trend-modal-title">
      <header><div><span>指标趋势分析</span><h3 id="trend-modal-title">{row[0]}</h3><p>年度数值与同比变化</p></div><button aria-label="关闭分析弹窗" onClick={onClose}><IconX size={22}/></button></header>
      <div className="trend-modal-chart"><MetricTrendCanvas row={row} years={years}/><div className="trend-legend"><span><i className="bar"/>{row[0]}</span><span><i className="line"/>同比变化</span></div></div>
      <div className="trend-modal-table"><div className="head"><span>序号</span><span>年度</span><span>{row[0]}（{row[1]}）</span><span>同比变化（%）</span></div>{series.map((item, index) => { const previous = numericSeries[index + 1]; const current = numericSeries[index]; const change = !previous ? "—" : `${(((current - previous) / previous) * 100).toFixed(2)}%`; return <div key={item.year}><span>{index + 1}</span><span>{item.year}</span><strong>{item.value}</strong><span>{change}</span></div>; })}</div>
    </section>
  </div>;
}

function CarbonMetricTable() {
  const [detail, setDetail] = useState(null);
  const [scope3Expanded, setScope3Expanded] = useState(false);
  const years = ["2025年", "2024年", "2023年", "2022年", "2021年"];
  function openDetail(row, type = "trend") { setDetail({ row, type }); }
  return <section className="intel-card intel-data-table carbon-metric-table"><header><div><strong>碳排放指标</strong><span>绝对排放量与单位营收排放强度</span></div><button><IconDownload size={14}/> 导出数据</button></header>
    <div className="carbon-table-scroll"><div className="carbon-table-head"><span>指标</span><span>单位</span>{years.map((year) => <span key={year}>{year}</span>)}</div>
      {carbonMetricGroups.map((group) => <div className="carbon-table-group" key={group.name}><div className="carbon-group-title">{group.name}</div>{group.rows.map((row) => <Fragment key={row[0]}><div className={`carbon-table-row ${row[0] === "碳排放量（范围三）" ? "scope3-parent-row" : ""}`}><span><button className="metric-name-button" onClick={() => openDetail(row)}>{row[0]}</button>{isQuantitativeMetric(row) && <button className="trend-entry" aria-label={`查看${row[0]}趋势`} onClick={() => openDetail(row)}><IconChartBar size={15}/></button>}{row[0] === "碳排放量（范围三）" && <button className={`scope3-toggle ${scope3Expanded ? "expanded" : ""}`} aria-label={scope3Expanded ? "收起范围三的15个类别" : "展开范围三的15个类别"} aria-expanded={scope3Expanded} onClick={() => setScope3Expanded(!scope3Expanded)}><IconChevronDown size={14}/></button>}</span><span>{row[1]}</span>{row.slice(2).map((value, index) => <span className={value === "—" ? "empty" : ""} key={`${value}-${index}`}>{value}{value !== "—" && index < 4 && group.name === "碳排放量" && <sup>*</sup>}</span>)}</div>{row[0] === "碳排放量（范围三）" && scope3Expanded && <div className="scope3-category-block">{scope3CategoryRows.map((categoryRow) => <div className="carbon-table-row scope3-category-row" key={categoryRow[0]}><span><button className="metric-name-button" onClick={() => openDetail(categoryRow)}>{categoryRow[0]}</button>{isQuantitativeMetric(categoryRow) && <button className="trend-entry" aria-label={`查看${categoryRow[0]}趋势`} onClick={() => openDetail(categoryRow)}><IconChartBar size={15}/></button>}</span><span>{categoryRow[1]}</span>{categoryRow.slice(2).map((value, index) => <span className={value === "—" ? "empty" : ""} key={`${categoryRow[0]}-${index}`}>{value}</span>)}</div>)}</div>}</Fragment>)}</div>)}
    </div>
    {detail && <TrendAnalysisModal row={detail.row} years={years} onClose={() => setDetail(null)}/>} 
  </section>;
}

function CarbonDimensionPanel() {
  return <div className="intel-dimension-body"><CarbonMetricTable /></div>;
}

const esgReportRows = [
  ["2025-04-16", "华能国际电力股份有限公司2024年可持续发展报告", "可持续发展报告", "上海证券交易所"],
  ["2024-04-24", "华能国际电力股份有限公司2023年可持续发展报告", "可持续发展报告", "上海证券交易所"],
  ["2023-04-26", "华能国际电力股份有限公司2022年环境、社会及治理报告", "ESG报告", "香港联交所"],
  ["2022-04-27", "华能国际电力股份有限公司2021年环境、社会及治理报告", "ESG报告", "香港联交所"],
  ["2021-04-28", "华能国际电力股份有限公司2020年环境、社会及治理报告", "ESG报告", "香港联交所"],
  ["2020-04-24", "华能国际电力股份有限公司2019年社会责任报告", "社会责任报告", "上海证券交易所"],
  ["2019-04-24", "华能国际电力股份有限公司2018年社会责任报告", "社会责任报告", "公司披露"],
  ["2018-04-25", "华能国际电力股份有限公司2017年社会责任报告", "社会责任报告", "公司披露"],
  ["2017-04-26", "华能国际电力股份有限公司2016年社会责任报告", "社会责任报告", "公司披露"],
  ["2016-04-21", "华能国际电力股份有限公司2015年社会责任报告", "社会责任报告", "公司披露"],
  ["2015-04-23", "华能国际电力股份有限公司2014年社会责任报告", "社会责任报告", "公司披露"],
  ["2014-04-24", "华能国际电力股份有限公司2013年社会责任报告", "社会责任报告", "公司披露"],
  ["2013-04-25", "华能国际电力股份有限公司2012年社会责任报告", "社会责任报告", "公司披露"],
  ["2012-04-26", "华能国际电力股份有限公司2011年社会责任报告", "社会责任报告", "公司披露"],
  ["2011-04-21", "华能国际电力股份有限公司2010年社会责任报告", "社会责任报告", "公司披露"],
  ["2010-04-22", "华能国际电力股份有限公司2009年社会责任报告", "社会责任报告", "公司披露"],
  ["2009-04-23", "华能国际电力股份有限公司2008年社会责任报告", "社会责任报告", "公司披露"],
  ["2008-04-24", "华能国际电力股份有限公司2007年社会责任报告", "社会责任报告", "公司披露"],
  ["2007-04-26", "华能国际电力股份有限公司2006年社会责任报告", "社会责任报告", "公司披露"],
];

function EsgReportTable() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(esgReportRows.length / pageSize);
  const visibleRows = esgReportRows.slice((page - 1) * pageSize, page * pageSize);
  return <section className="intel-card esg-report-table">
    <header><div><strong>ESG 报告 <b>{esgReportRows.length}</b></strong><span>企业历年可持续发展与环境、社会及治理披露</span></div></header>
    <div className="esg-report-scroll"><div className="esg-report-head"><span>序号</span><span>发布日期</span><span>标题</span><span>类型</span><span>来源</span></div>{visibleRows.map((row, index) => <div className="esg-report-row" key={row[1]}><span>{(page - 1) * pageSize + index + 1}</span><span>{row[0]}</span><button>{row[1]}</button><span>{row[2]}</span><span>{row[3]}</span></div>)}</div>
    <footer className="esg-report-pagination"><span>共 {esgReportRows.length} 条，每页 {pageSize} 条</span><div><button aria-label="上一页" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><IconChevronRight size={14}/></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button className={page === number ? "active" : ""} key={number} onClick={() => setPage(number)}>{number}</button>)}<button aria-label="下一页" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}><IconChevronRight size={14}/></button></div></footer>
  </section>;
}

function EsgPerformanceModule({ performance }) {
  const current = esgPerformanceCatalog[performance];
  const categories = Object.keys(current.categories).filter((name) => performance !== "环境绩效" || !["环境保护", "温室气体"].includes(name));
  const [category, setCategory] = useState(categories[0]);
  const [detail, setDetail] = useState(null);
  const rows = current.categories[category];
  return <section className="intel-card esg-performance-card esg-performance-module">
      <div className="esg-category-section"><header><div><span>ESG / {current.code}</span><h3>{performance}</h3></div><strong>{categories.reduce((sum, name) => sum + current.categories[name].length, 0)} 个结构化字段</strong></header><div className="esg-category-pills">{categories.map((name) => <button className={category === name ? "active" : ""} key={name} onClick={() => { setCategory(name); setDetail(null); }}>{name}</button>)}</div></div>
      <div className="esg-field-scroll"><div className="esg-field-head"><span>指标</span><span>单位</span>{esgYears.map((year) => <span key={year}>{year}</span>)}</div>{rows.map((row) => <div className="esg-field-row" key={row[0]}><span>{row[0]}{isQuantitativeMetric(row) && <button className="trend-entry" aria-label={`查看${row[0]}趋势`} onClick={() => setDetail({ row, type: "trend" })}><IconChartBar size={15}/></button>}</span><span>{row[1]}</span>{row.slice(2).map((value, index) => value === "查看" ? <button className="policy-link" key={`${value}-${index}`} onClick={() => setDetail({ row, type: "policy" })}>查看</button> : <span className={value === "—" ? "empty" : ""} key={`${value}-${index}`}>{value}</span>)}</div>)}</div>
      {detail?.type === "policy" && <div className="carbon-metric-detail esg-metric-detail"><div><span>披露详情</span><strong>{detail.row[0]}</strong></div><button aria-label="关闭指标详情" onClick={() => setDetail(null)}><IconX size={16}/></button><dl>{esgYears.map((year, index) => <div key={year}><dt>{year}</dt><dd>{detail.row[index + 2]}</dd></div>)}</dl><p>已关联企业年度报告、ESG报告和交易所公告中的相关原文。</p></div>}
      {detail?.type === "trend" && <TrendAnalysisModal row={detail.row} years={esgYears} onClose={() => setDetail(null)}/>} 
    </section>;
}

function EsgDimensionPanel() {
  return <div className="intel-dimension-body esg-sequential-page">
    <EsgReportTable />
    {Object.keys(esgPerformanceCatalog).map((performance) => <EsgPerformanceModule performance={performance} key={performance} />)}
  </div>;
}

const productFootprints = [
  { image: "/assets/product-wind.png", name: "海上风电机组整机", model: "HN-WTG-6250", footprint: "1,846.72 tCO₂e/台", unit: "1 台 6.25MW 风电机组", period: "2024.01.01–2024.12.31", boundary: "摇篮到大门" },
  { image: "/assets/product-solar.png", name: "高效单晶硅光伏组件", model: "HN-PV-585N", footprint: "428.60 kgCO₂e/kWp", unit: "1 kWp 光伏组件", period: "2024.01.01–2024.12.31", boundary: "摇篮到大门" },
  { image: "/assets/product-storage.png", name: "磷酸铁锂储能系统", model: "HN-ESS-215", footprint: "92.84 kgCO₂e/kWh", unit: "1 kWh 额定储能容量", period: "2024.01.01–2024.12.31", boundary: "全生命周期" },
  { image: "/assets/product-turbine.png", name: "燃气轮机发电机组", model: "HN-GT-F50", footprint: "3,928.50 tCO₂e/MW", unit: "1 MW 装机容量", period: "2023.01.01–2023.12.31", boundary: "摇篮到大门" },
  { image: "/assets/product-monopile.png", name: "海上风电单桩基础", model: "HN-MP-1000", footprint: "1,638.90 tCO₂e/件", unit: "1 件单桩基础", period: "2024.01.01–2024.12.31", boundary: "摇篮到工地" },
  { image: "/assets/product-charger.png", name: "直流双枪充电终端", model: "HN-EVDC-240", footprint: "286.40 kgCO₂e/台", unit: "1 台 240kW 充电终端", period: "2024.01.01–2024.12.31", boundary: "全生命周期" },
];

function ProductFootprintPanel({ companyName = enterpriseProfile.name }) {
  return <div className="intel-dimension-body product-footprint-body">
    <div className="product-footprint-toolbar"><div><strong>已披露核算产品</strong><span>共 {productFootprints.length} 个产品 · 数据来自企业产品碳足迹报告与核算声明</span></div><button>全部产品 <IconChevronDown size={14}/></button></div>
    <section className="product-footprint-grid">{productFootprints.map((product) => <article className="product-footprint-card" key={product.model}>
      <div className="product-footprint-image"><img src={assetUrl(product.image)} alt={product.name}/></div>
      <div className="product-footprint-info"><span>{companyName}</span><h3>{product.name}</h3><em>{product.model}</em><dl><div><dt>碳足迹</dt><dd>{product.footprint}</dd></div><div><dt>功能单位</dt><dd>{product.unit}</dd></div><div><dt>核算周期</dt><dd>{product.period}</dd></div></dl><footer><b><IconLeaf size={13}/> 已完成产品碳核算</b><small>{product.boundary}</small></footer></div>
    </article>)}</section>
  </div>;
}

const enterpriseProfile = {
  name: "华能国际电力股份有限公司",
  creditCode: "91110000625905205U",
  legalRepresentative: "王葵",
  status: "在营（开业）",
  founded: "1994-06-30",
  type: "股份有限公司",
  capital: "1,569,809.34 万元",
  term: "1994-06-30 至 9999-09-09",
  formerName: "—",
  industry: "电力生产",
  region: "河北省",
  address: "河北省雄安新区启动区华能总部",
  phone: "010-63226999",
  scope: "投资、建设、经营管理电厂；开发、投资、经营以出口为主的其他相关企业；热力生产及供应（仅限获得当地政府核准的分支机构）；电力生产（限分支机构经营）；电力供应。（市场主体依法自主选择经营项目，开展经营活动；电力供应以及依法须经批准的项目，经相关部门批准后依批准的内容开展经营活动；不得从事国家和本市产业政策禁止和限制类项目的经营活动。）",
};

const enterpriseSuppliers = [
  ["毕马威华振会计师事务所(特殊普通合伙)", ["在营", "大型企业"]],
  ["嘉林资本有限公司", ["在营"]],
  ["北京亿飞成安全技术有限公司", ["在营"]],
  ["安永(中国)企业咨询有限公司", ["在营", "大型企业"]],
  ["北京冠程科技有限公司", ["在营", "高新技术企业", "科技型中小企业", "创新型中小企业"]],
  ["大连澳司朗光电科技有限公司", ["在营"]],
  ["立信会计师事务所(特殊普通合伙)", ["在营", "大型企业"]],
  ["远光软件股份有限公司", ["在营", "A股", "国有企业", "大型企业", "高新技术企业", "广东省企业技术中心"]],
  ["中科软科技股份有限公司", ["在营", "A股", "国有企业", "大型企业", "高新技术企业", "北京市企业技术中心"]],
  ["中国太平洋财产保险股份有限公司深圳分公司", ["在营"]],
];

function EnterpriseProfilePanel({ profile = enterpriseProfile }) {
  return <section className="enterprise-profile">
    <div className="enterprise-profile-summary">
      <dl>
        <div><dt>企业名称</dt><dd>{profile.name}</dd></div><div><dt>统一社会信用代码</dt><dd>{profile.creditCode}</dd></div><div><dt>联系方式</dt><dd className="profile-link">{profile.phone} <small>更多 2</small></dd></div>
        <div><dt>法定代表人</dt><dd>{profile.legalRepresentative}</dd></div><div><dt>登记状态</dt><dd>{profile.status}</dd></div><div><dt>成立日期</dt><dd>{profile.founded}</dd></div>
        <div><dt>企业类型</dt><dd>{profile.type}</dd></div><div><dt>注册资本</dt><dd>{profile.capital}</dd></div><div><dt>营业期限</dt><dd>{profile.term}</dd></div>
        <div><dt>曾用名</dt><dd>{profile.formerName}</dd></div><div><dt>所属行业</dt><dd>{profile.industry}</dd></div><div><dt>所属地区</dt><dd>{profile.region}</dd></div>
        <div className="profile-address"><dt>注册地址</dt><dd>{profile.address}</dd></div>
      </dl>
      <div className="profile-scope"><span>经营范围</span><p>{profile.scope}</p></div>
    </div>
  </section>;
}

function EnterpriseIntelView() {
  const [dimension, setDimension] = useState("carbon");
  const routeQuery = new URLSearchParams(window.location.hash.split("?")[1] || window.location.search.slice(1));
  const company = companies.find((item) => item.id === routeQuery.get("company")) || companies[0];
  const profile = company.id === "huaneng" ? enterpriseProfile : {
    name: company.name, creditCode: company.creditCode || "—", legalRepresentative: company.legalPerson || "—", status: company.regStatus || "存续",
    founded: company.established || "—", type: company.companyType || "股份有限公司", capital: "以工商登记为准", term: "长期",
    formerName: "—", industry: company.industry, region: company.city, address: `${company.city}企业注册地址`, phone: "公开联系方式待补充",
    scope: `${company.industry}相关产品与服务的研发、生产、销售及配套经营活动；具体经营项目以企业工商登记及公开披露为准。`,
  };
  const dimensionMeta = {
    carbon: ["CARBON", "碳排放", "查看企业温室气体排放、能源结构、减排目标及历史趋势。"],
    esg: ["ESG", "ESG 表现", "查看环境、社会和治理表现，以及报告、评级与关键议题。"],
    product: ["PRODUCT CARBON FOOTPRINT", "产品碳足迹", "查看企业已披露核算产品的碳足迹、功能单位、核算周期与边界。"],
  }[dimension];
  return <main className="enterprise-intel-shell">
    <div className="intel-breadcrumb intel-breadcrumb-top"><button onClick={() => window.location.assign(appRouteUrl("admin"))}>企业碳数据</button><IconChevronRight size={13}/><button onClick={() => window.location.assign(appRouteUrl("admin/list"))}>企业列表</button><IconChevronRight size={13}/><span>{company.short}</span><IconChevronRight size={13}/><strong>{dimensionMeta[1]}</strong></div>
    <section className="intel-company-hero"><div className="intel-company-mark">{company.short.slice(0,2)}</div><div className="intel-company-name"><div><h1>{company.name}</h1></div><div><span>{company.regStatus || "存续"}</span>{(company.tags || [company.industry, company.city]).map((tag) => <span key={tag}>{tag}</span>)}</div></div></section>
    <EnterpriseProfilePanel profile={profile}/>
    <section className="intel-content"><aside className="intel-side-nav"><span>数据维度</span><button className={dimension === "carbon" ? "active" : ""} onClick={() => setDimension("carbon")}><IconCloud size={18}/><div><strong>碳排放</strong><small>核算、趋势与目标</small></div><IconChevronRight size={15}/></button><button className={dimension === "esg" ? "active" : ""} onClick={() => setDimension("esg")}><IconScale size={18}/><div><strong>ESG</strong><small>评级与三大支柱</small></div><IconChevronRight size={15}/></button><button className={dimension === "product" ? "active" : ""} onClick={() => setDimension("product")}><IconFootsteps size={18}/><div><strong>产品碳足迹</strong><small>产品核算与披露</small></div><IconChevronRight size={15}/></button></aside><section className="intel-main-panel"><header className="intel-dimension-header"><div><span>数据维度 / {dimensionMeta[0]}</span><h2>{dimensionMeta[1]}</h2><p>{dimensionMeta[2]}</p></div><div><button><IconDownload size={16}/> 导出</button><button className="primary"><IconSparkles size={16}/> 智能解读</button></div></header>{dimension === "carbon" ? <CarbonDimensionPanel/> : dimension === "esg" ? <EsgDimensionPanel/> : <ProductFootprintPanel companyName={company.name}/>}</section></section>
  </main>;
}

const overviewMetrics = [
  { icon: IconBuilding, label: "企业总数", value: "12,680", change: "+126 本月", tone: "green" },
  { icon: IconFileDescription, label: "披露源文件", value: "48,620", change: "+1,284 本周", tone: "purple" },
  { icon: IconShieldCheck, label: "高质量档案", value: "6,731", change: "质量 A / B", tone: "amber" },
];

const industryDistribution = [
  ["电力与能源", 2680, 86], ["工业制造", 2350, 76], ["交通与汽车", 1840, 60],
  ["原材料", 1560, 51], ["建筑与地产", 1120, 37], ["其他行业", 3130, 100],
];

const sourceHealth = [
  ["交易所公告", "正常", "18 分钟前", 98], ["企业官网", "正常", "36 分钟前", 94],
  ["环境监管平台", "正常", "2 小时前", 91], ["SBTi / CDP", "待更新", "1 天前", 78],
];

function AdminSidebar({ page, onNavigate }) {
  const activePage = page === "detail" ? "list" : page;
  return <aside className="admin-sidebar">
    <div className="admin-brand"><div className="admin-brand-mark"><IconLeaf size={20} /></div><div><strong>运营平台</strong><span>碳管理后台</span></div><IconLayoutSidebarLeftCollapse size={20} /></div>
    <div className="admin-nav-group"><span>业务管理</span>
      <button><IconLayoutGrid size={18} />工作台</button>
      <button><IconUsersGroup size={18} />组织管理</button>
      <button><IconFootsteps size={18} />产品碳足迹</button>
      <button><IconFileDescription size={18} />企业碳核算<IconChevronRight size={15} /></button>
      <div className="admin-nav-parent active carbon-data-parent"><button className="admin-parent-button"><IconDatabase size={17} />企业碳数据<IconChevronDown size={15} /></button>
        <div className="admin-subnav">
          <button className={activePage === "overview" ? "active" : ""} onClick={() => onNavigate("overview")}><IconChartBar size={16} />数据概览</button>
          <button className={activePage === "list" ? "active" : ""} onClick={() => onNavigate("list")}><IconListDetails size={16} />企业列表</button>
          <button className={activePage === "fields" ? "active" : ""} onClick={() => onNavigate("fields")}><IconFileDescription size={16} />字段管理</button>
        </div>
      </div>
    </div>
    <div className="admin-nav-group admin-data-nav"><span>数据中心</span>
      <button><IconBolt size={18} />排放因子<IconChevronRight size={15} /></button>
    </div>
    <div className="admin-sidebar-foot"><div className="admin-avatar">姚</div><div><strong>姚凯鹏</strong><span>超级管理员</span></div><IconChevronRight size={16} /></div>
  </aside>;
}

function AdminTopbar({ title, description, action }) {
  return <header className="admin-topbar"><div><div className="admin-breadcrumb">运营平台 <IconChevronRight size={13} /> 企业碳数据 <IconChevronRight size={13} /> <span>{title}</span></div><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

function AdminOverview({ onOpenList, onOpenDetail }) {
  return <div className="admin-page"><AdminTopbar title="数据概览" description="集中监控企业碳数据规模、完整度、数据质量与更新状态。" action={<button className="admin-primary" onClick={onOpenList}>查看企业列表 <IconArrowRight size={16} /></button>} />
    <div className="admin-page-body">
      <section className="admin-metric-grid">{overviewMetrics.map(({ icon: Icon, label, value, change, tone }) => <article className={`admin-metric ${tone}`} key={label}><div className="metric-icon"><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong><small>{change}</small></div><i /></article>)}</section>
      <section className="admin-overview-grid">
        <article className="admin-panel admin-ingestion-panel"><header><div><strong>企业库增长趋势</strong><span>近 7 天新增企业与源文件入库情况</span></div><button>近 7 天 <IconChevronDown size={14} /></button></header><div className="admin-legend"><span><i className="enterprise" />新增企业</span><span><i className="documents" />新增源文件</span></div><div className="admin-bars">{[[42,70],[54,82],[38,60],[72,92],[64,78],[86,100],[76,94]].map(([enterprise, documents], index) => <div key={index}><div className="bar-pair"><i className="enterprise" style={{ height: `${enterprise}%` }} /><i className="documents" style={{ height: `${documents}%` }} /></div><span>{["08/20","08/21","08/22","08/23","08/24","08/25","今天"][index]}</span></div>)}</div></article>
        <article className="admin-panel admin-industry-panel"><header><div><strong>行业分布</strong><span>当前已归档企业的行业结构</span></div><button>全部行业 <IconChevronDown size={14} /></button></header><div className="industry-bars">{industryDistribution.map(([label, value, width]) => <div key={label}><span>{label}</span><i><em style={{ width: `${width}%` }} /></i><strong>{value.toLocaleString()}</strong></div>)}</div></article>
      </section>
      <section className="admin-panel admin-recent"><header><div><strong>最近更新企业</strong><span>优先展示档案发生变化或需要复核的企业</span></div><button onClick={onOpenList}>全部企业 <IconArrowRight size={14} /></button></header><div className="admin-recent-table"><div className="head"><span>企业</span><span>行业</span><span>档案完整度</span><span>源文件</span><span>最近更新</span><span>状态</span></div>{companies.slice(0, 5).map((company, index) => <button key={company.id} onClick={() => onOpenDetail(company)}><span className="recent-company"><i>{company.short.slice(0, 1)}</i><b>{company.name}<small>{company.code}</small></b></span><span>{company.industry}</span><span><em className="mini-progress"><i style={{ width: `${company.completeness}%` }} /></em>{company.completeness}%</span><span>{12 + index * 3} 份</span><span>{company.updated}</span><span className={index === 3 ? "review" : "ready"}>{index === 3 ? "需复核" : "已更新"}</span></button>)}</div></section>
    </div>
  </div>;
}

function AdminCompanyList({ onOpenDetail }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("全部行业");
  const filtered = companies.filter((company) => (industry === "全部行业" || company.industry === industry) && (company.name.includes(query) || company.creditCode.includes(query) || company.legalPerson.includes(query) || company.industry.includes(query)));
  const industries = ["全部行业", ...new Set(companies.map((company) => company.industry))];
  return <div className="admin-page"><AdminTopbar title="企业列表" description="管理所有已识别企业，点击企业名称进入完整企业碳档案。" action={<button className="admin-primary"><IconDownload size={16} />导出企业清单</button>} />
    <div className="admin-page-body"><section className="admin-panel admin-company-table-panel">
      <div className="admin-table-toolbar"><div className="admin-search"><IconSearch size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索企业名称、统一社会信用代码、法人或行业" /></div><div className="admin-filter-wrap"><select value={industry} onChange={(event) => setIndustry(event.target.value)}>{industries.map((item) => <option key={item}>{item}</option>)}</select></div></div>
      <div className="admin-table-summary"><span>全部企业 <b>12,680</b></span><span>当前展示 {filtered.length} 条样例数据</span></div>
      <div className="admin-company-table"><div className="head"><span>企业名称</span><span>统一社会信用代码</span><span>法定代表人</span><span>登记状态 / 企业类型</span><span>成立日期</span><span>所属行业</span><span /></div>{filtered.map((company) => <button key={company.id} onClick={() => onOpenDetail(company)}><span className="table-company"><i>{company.short.slice(0, 1)}</i><b>{company.name}<small>{company.city}</small></b></span><span className="credit-code">{company.creditCode}</span><span>{company.legalPerson}</span><span className="registry-cell"><em className="registry-status">{company.regStatus}</em><small>{company.companyType}</small></span><span>{company.established}</span><span>{company.industry}</span><span><IconChevronRight size={16} /></span></button>)}</div>
      <footer className="admin-pagination"><span>共 12,680 条</span><div><button disabled>上一页</button><button className="active">1</button><button>2</button><button>3</button><button>下一页</button></div></footer>
    </section></div>
  </div>;
}

const fieldManagementRows = [
  ["企业基础信息", "企业主体", "工商、上市及组织关系", 24, "系统字段"],
  ["温室气体排放", "碳排放", "范围一、二、三及排放强度", 18, "核心字段"],
  ["环境绩效", "ESG", "环境保护、能源、水资源及废弃物", 34, "披露字段"],
  ["社会绩效", "ESG", "员工、健康安全、供应商及公益", 31, "披露字段"],
  ["治理绩效", "ESG", "股东、董监高、合规及信息披露", 38, "披露字段"],
];

function AdminFieldManagement() {
  const [query, setQuery] = useState("");
  const rows = fieldManagementRows.filter((row) => row.some((cell) => String(cell).includes(query)));
  return <div className="admin-page"><AdminTopbar title="字段管理" description="统一维护企业基础、碳排放与 ESG 数据字段及分类口径。" action={<button className="admin-primary"><IconFileDescription size={16} />新增字段</button>} />
    <div className="admin-page-body"><section className="admin-field-stats"><article><span>字段总数</span><strong>145</strong><small>已启用 145</small></article><article><span>碳排放字段</span><strong>18</strong><small>含五年历史数据</small></article><article><span>ESG 字段</span><strong>103</strong><small>覆盖 24 个子类别</small></article></section>
      <section className="admin-panel admin-field-panel"><div className="admin-table-toolbar"><div className="admin-search"><IconSearch size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索字段分组、数据域或说明" /></div><div className="admin-filter-wrap"><button><IconFilter size={16}/>全部数据域</button><button><IconShieldCheck size={16}/>启用中</button></div></div><div className="admin-field-table"><div className="head"><span>字段分组</span><span>数据域</span><span>字段说明</span><span>字段数</span><span>类型</span><span>状态</span></div>{rows.map(([name, domain, description, count, type]) => <button key={name}><span><b>{name}</b><small>更新于 2026-09-09</small></span><span>{domain}</span><span>{description}</span><span>{count}</span><span>{type}</span><span><em>已启用</em><IconChevronRight size={15}/></span></button>)}</div></section>
    </div>
  </div>;
}

function AdminApp() {
  const [page, setPage] = useState(window.location.hash === "#list" ? "list" : "overview");
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  function openDetail(company) { window.location.assign(appRouteUrl(`enterprise?from=admin&company=${company.id}`)); }
  return <div className="admin-shell"><AdminSidebar page={page} onNavigate={setPage} /><section className="admin-main">{page === "overview" && <AdminOverview onOpenList={() => setPage("list")} onOpenDetail={openDetail} />}{page === "list" && <AdminCompanyList onOpenDetail={openDetail} />}{page === "fields" && <AdminFieldManagement />}{page === "detail" && <CompanyDetailView company={selectedCompany} onBack={() => setPage("list")} />}</section></div>;
}

export function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathnameRoute = window.location.pathname.replace(basePath, "") || "/";
  const routePath = window.location.hash.startsWith("#/") ? window.location.hash.slice(1).split("?")[0] : pathnameRoute;
  if (routePath.startsWith("/enterprise")) return <EnterpriseIntelView />;
  if (routePath.startsWith("/admin")) return <AdminApp />;
  const [view, setView] = useState("chat");
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [followedIds, setFollowedIds] = useState(["byd", "longi", "huaneng", "midea", "baosteel", "zijin"]);
  function navigate(next) { setView(next); }
  function openDetail(company = companies[0]) {
    window.location.assign(appRouteUrl(`enterprise?from=followed&company=${company.id}`));
  }
  function setCatlFollowed(next) { setFollowedIds((ids) => next ? [...new Set([...ids, "catl"])] : ids.filter((id) => id !== "catl")); }
  const followedCompanies = companies.filter((company) => followedIds.includes(company.id));
  return <div className="app-shell knowledge-app"><Sidebar view={view} onNavigate={navigate} />{view === "chat" && <ChatView onOpenDetail={() => openDetail(companies[0])} followed={followedIds.includes("catl")} onFollowChange={setCatlFollowed} />}{view === "companies" && <CompanyListView followedCompanies={followedCompanies} onOpenDetail={openDetail} onFollowChange={setFollowedIds} />}{view === "detail" && <CompanyDetailView company={selectedCompany} onBack={() => setView("companies")} />}</div>;
}
