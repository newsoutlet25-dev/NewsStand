import {absoluteUrl, jsonLd, siteName} from '../lib/site';

export const publisherId = absoluteUrl('/#publisher');
const websiteId = absoluteUrl('/#website');
export const team = {'@type':'Organization', '@id':absoluteUrl('/authors/editorial-team#team'), name:'فريق التحرير', url:absoluteUrl('/authors/editorial-team'), parentOrganization:{'@id':publisherId}};

function Graph({nodes}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@graph':nodes})}}/>;
}

export function SiteSchema() {
  return <Graph nodes={[
    {'@type':'NewsMediaOrganization','@id':publisherId, name:siteName, url:absoluteUrl('/'), logo:{'@type':'ImageObject',url:absoluteUrl('/brand/mshraq.svg'),width:512,height:512}},
    {'@type':'WebSite','@id':websiteId, url:absoluteUrl('/'), name:siteName, inLanguage:'ar',publisher:{'@id':publisherId}}
  ]}/>;
}

export function PageSchema({type='WebPage',path,name,parents=[],entity}) {
  const url=absoluteUrl(path);
  const page={'@type':type,'@id':url+'#webpage',url,name,inLanguage:'ar',isPartOf:{'@id':websiteId},publisher:{'@id':publisherId}};
  const nodes=[page];
  if(entity) { page.mainEntity={'@id':entity['@id']};nodes.push(entity); }
  if(path!=='/') {
    const trail=[['الرئيسية','/'],...parents,[name,path]];
    page.breadcrumb={'@id':url+'#breadcrumb'};
    nodes.push({'@type':'BreadcrumbList','@id':page.breadcrumb['@id'],itemListElement:trail.map(([label,href],i)=>({'@type':'ListItem',position:i+1,name:label,item:absoluteUrl(href)}))});
  }
  return <Graph nodes={nodes}/>;
}
