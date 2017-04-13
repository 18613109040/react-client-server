export function trackPageView(title){
  _paq.push(["trackPageView", title||"固生堂中医"])
}
/*
 * @category 类型
 * @action 操作事件 如click 
 * @name 操作名称(可选)
 * @value 值（可选）
 */
export function trackEvent(category, action, name="", value=""){
  if(!category || !action) {
    console.error("piwik trackEvent: category or action is required");
    return
  };
  _paq.push(["trackEvent", category, action, name])
}
// 追踪链接
// 如<a href={`/searchresult?type=jibing&city_code=${this.state.city_no}&char=月经不调`} data-category="常见疾病" onClick={trackEventLink().bind()}>月经不调</a>
export function trackEventLink(callBack=()=>{}){
  return (e)=>{
    const target = $(e.target);
    const category = target.data("category");
    const action = target.data("action") || "click"
    const name = target.data("name") || target.html();
    if(!category){
      console.error("piwik trackEventLink: category is required");
      callBack(e);
      return;
    }
    trackEvent(category, action, name);
    callBack(e)
  }
}

// 支持a标签
export function trackLink(callBack=(e)=>{}){
  return (e)=>{
    const target = $(e.target);
    const url = target.attr("href");
    const linkType = target.data("linkType");
    if(!url || !linkType){
      console.error("piwik trackLink: href of linkType is required", url, linkType, target);
      callBack(e);
      return;
    }
    _paq.push(["trackLink", url, linkType]);
    callBack(e);
  }
}

const Piwik = {
  trackPageView: trackPageView,
  trackEvent: trackEvent,
  trackEventLink: trackEventLink,
  trackLink: trackLink
}

export default Piwik;
