/**
 * WYMeditor integration into Radiant.
 */

// boot jQuery
jQuery.noConflict();

// add window load event
Event.observe(window, 'load', init_load_wym_editor, false);

// references to the WYMeditor instances
var editors = new Array();

// These tokens are for Radiant CMS radius tags  
//XhtmlLexer.prototype.addTokens = function()
//{
//  this.addEntryPattern("</?r:", 'Text', 'Text');
//  this.addExitPattern(">", 'Text'); 
//  
//  this.addCommentTokens('Text');
//  this.addScriptTokens('Text');
//  this.addCssTokens('Text');
//  this.addTagTokens('Text');
//}

/**
 * Loads the WYMeditor for page parts where "WymEditor" is the selected text
 * filter and observe the Radiant buttons for saving the page.
 */
function init_load_wym_editor(){
	// add "wymupdate" class to the save buttons:
	for (var i = 0; i < $$(".button").length; i++){
		//$($$(".button")[i]).addClassName('wymupdate');
		// on save, run wymupdate and unboot on all instances;
		Event.observe($$(".button")[i], 'click', unboot_all_wym)
	}

  // check to see if we are working with a page or with a snippet
  if ($('part_0_filter_id'))
  {
    var parts = jQuery('.textarea');
    for (var i = 0; i < parts.length; i++)
    {
      if ($F('part_' + i + '_filter_id') == 'WymEditor') {
				// mark textarea's that need to be wymified
				$('part_'+i+'_content').addClassName('wymified');
      }
    }
		// boot wym on marked textarea's
		ta = $$(".wymified");
		for (var i = 0; i < ta.length; i++){
			boot_wym(ta[i]);
		}
		
  } else if ($('snippet_filter')) {
    if ($F('snippet_filter') == 'WymEditor') {
			boot_wym(jQuery('.textarea')[0]);
    }
  }
}

/**
 * A new text filter has been set on a text area, so boot/unboot visual
 * editor instances
 *
 * @param index - the page part number
 * @param filter - the new page part filter
 */
function text_input_method(index, filter) {
	if (index != null) {
		// control for page parts
		var elem = $('part_'+(index)+'_content');
		if (filter == "WymEditor") {
			boot_wym(elem);
		} else {
			unboot_wym(elem)
		}
	} else {
		// control for snippets
		var elem = $$('.textarea');
		if (filter == "WymEditor") {
			boot_wym(elem[0]);
		} else {
			unboot_wym(elem[0]);
		}
	}
}

/**
* Boots a single WYMeditor instance
*
* @param elem - the textarea with the content to visualize
*/
function boot_wym(elem) {

  // construct a wymeditor with overridden values and functions
  jQuery(elem).wymeditor({

    lang: 'en',
    skin: 'radiant',
    iframeBasePath: '/wymeditor/wymeditor/iframe/radiant/',

    classesItems: [
          {'name': 'float_left', 'title': 'PARA: left', 'expr': 'p'},
          {'name': 'float_right', 'title': 'PARA: right', 'expr': 'p'},
          {'name': 'maxwidth', 'title': 'PARA: maxwidth', 'expr': 'p'},
          {'name': 'narrow', 'title': 'PARA: narrow', 'expr': 'p'}
		],

    editorStyles: [
		  {'name': '.float_left',
		   'css': 'color: #999; border: 2px solid #ccc;'},
		  {'name': '.float_right',
		   'css': 'color: #999; border: 2px solid #ccc;'},
		  {'name': '.maxwidth',
		   'css': 'color: #333; border: 2px solid #ccc;'},
		  {'name': '.narrow',
		   'css': 'color: #666; border: 2px solid #CCC;'},
		  {'name': '.radius_tag',
       'css': 'height:31px; background:url(/images/admin/wef_radiustag_bg.gif) no-repeat 0 0;'},
      {'name': 'div',
       'css': 'background:#fafceb url(/images/admin/lbl-div.png) no-repeat 2px 2px; margin:10px; padding:10px;'}
    ],

    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_LINK
               + "' />"
               + "<legend>{Link}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label><br/>"
               + "<input type='text' class='wym_href' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label><br/>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

   dialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_IMAGE
               + "' />"
               + "<legend>{Image}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label><br/>"
               + "<input type='text' class='wym_src' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Alternative_Text}</label><br/>"
               + "<input type='text' class='wym_alt' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label><br/>"
               + "<input type='text' class='wym_title' value='' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogTableHtml:  "<body class='wym_dialog wym_dialog_table'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_TABLE
               + "' />"
               + "<legend>{Table}</legend>"
               + "<div class='row'>"
               + "<label>{Caption}</label><br/>"
               + "<input type='text' class='wym_caption' value='' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Summary}</label><br/>"
               + "<input type='text' class='wym_summary' value=''/>"
               + "</div>"
               + "<div class='row row-rows'>"
               + "<label>{Number_Of_Rows}</label>"
               + "<input type='text' class='wym_rows' value='3' size='3' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Cols}</label>"
               + "<input type='text' class='wym_cols' value='2' size='3' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPasteHtml:  "<body class='wym_dialog wym_dialog_paste'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_PASTE
               + "' />"
               + "<fieldset>"
               + "<legend>{Paste_From_Word}</legend>"
               + "<div class='row'>"
               + "<textarea class='wym_text' rows='10'></textarea>"
               + "</div>"
               + "<div class='row'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<a href='#' class='wym_cancel'>{Cancel}</a>"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    /**
     * Enhance the visual editor after construction:
     *
     * - accept asset dropping
     * - auto adjust iframe
     *
     * @param wym - the editor
     */
    postInit: function(wym) {

      // map the index of this instance to it's page_part
      editors[elem.id] = wym._index;

      // enhancements to the editor
      bind_droppability(wym._iframe);
      adjustFramesize(wym._iframe);
    },

    /**
     * Initialize the editor before construction of the visual editor:
     *
     * - convert radius tags
     *
     * @param wym - the editor
     */
    preInit: function(wym) {

      // get editor content
      var content = (wym._html);

      // convert radius tags to hr element images representations
      var m = content.match(/(<r:([^\/><]*)?\/?>)|(<\/r:([^>]*)?>)/g);
      if (!(m == null)) {
        for (var i=0; i < m.length; i++) {
          var title = m[i].replace(/"/g, "'");
          title = title.substring(1,title.length-1);
          var match = escape(m[i].substring(1,m[i].length - 1));
          var regex = new RegExp('(' + m[i] + ')', 'i');
          var content = content.replace(regex, '<hr class="radius_tag" title="' + title + '" />');
        }
      }

      // save converted html
      wym._html = content;
    }

  });
}

/**
 * Unboots the WYMeditor:
 *
 *  - remove the wym editor div element
 *  - convert radius images to tags
 *  - fix page attachments and assets URLs.
 *
 * @param elem - the original text area
 */
function unboot_wym(elem){

  // hide wym
  jQuery(elem).parent().find(".wym_box").remove();

  // get visual editor content
  var id = editors[elem.id];
  var content = WYMeditor.INSTANCES[id].xhtml();

  // revert images to radius tags
  var regex = new RegExp('<hr class="radius_tag" title="(.*?)" />', 'gi');
  var m = content.match(regex);
  if (!(m == null)) {
    for (var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, '<$1>'));
      var content = content.replace(m[i], match);
    }
  }

  // fix urls to page attachments
  var regex = new RegExp('src="([\.\/]+)/page_attachments', 'g');
  var m = content.match(regex);
  if(!(m == null)) {
    for(var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, 'src="/page_attachments'));
      var content = content.replace(m[i], match)
    }
  }

  // fix urls to assets
  var regex = new RegExp('src="([\.\/]+)/assets', 'g');
  var m = content.match(regex);
  if(!(m == null)) {
    for(var i=0; i<m.length; i++) {
      var match = unescape(m[i].replace(regex, 'src="/assets'));
      var content = content.replace(m[i], match)
    }
  }

  // update textarea content
  elem.value = content;

  // show textarea again
  jQuery(elem).show();
}

/**
 * The page will be saved, unboot all WYMeditor instances:
 *
 * - update the editor
 *
 * @return true if successfull
 */
function unboot_all_wym() {
// save button clicked, update all wym instances
  if ($('part_0_filter_id'))                        // We're on the page edit screen
  {
    for(var i=0;i<$$(".part").length;i++) {
      // Find all parts that have WYM set as filter
      filter_select = $("part_" + i + "_filter_id");
      if(filter_select.value == 'WymEditor'){
        unboot_wym($('part_'+ i +'_content'));
      } 
    }
  } else if ($('snippet_filter')) {                // We're on the snippet edit screen
    if ($F('snippet_filter') == 'WymEditor') {
      unboot_wym($$('.textarea'));
    }
  }
  return true;
}

/**
 * Accept assets droping to the visual editor
 *
 * @param box - the drop box (visual editor iframe)
 */
function bind_droppability(box) {

  Droppables.add(box, {

    accept: 'asset',
    
    /* An element has been dropped into the iframe
     * 
     * @param element - the dropped element
     */
    onDrop: function(element) {

      // get asset information
      var classes = element.className.split(' ');
      var tag_type = classes[0];
      var link = element.select('a.bucket_link')[0];

      if(tag_type == 'image') {
        // copy the original image to WYM
        var tag = '<img src="'+ link.href +'" alt="'+ link.title +'" />';
      }
      else {
        // copy a link to WYM
        var asset_id = element.id.split('_').last();
        var tag = '<a href="'+ link.href +'">'+ link.title +'</a>'
      }

      var wym_index = editors["part_" + (box.ancestors()[2].ancestors()[1].id.split('-')[1] - 1)  + "_content"];
      var wymm = WYMeditor.INSTANCES[wym_index];
      wymm.insert(tag);
    }
  });
  
  new Draggable('asset-bucket');
}


/**
 * Adjusts the height of the iframe when the content of the visual editor is
 * changed.
 */
function adjustFramesize(iframe) {

// iframe not unbooted?
  if (iframe.contentWindow) {

    // adjust iframe height
    iframe.style.height = (iframe.contentWindow.document.body.offsetHeight + 35) + "px";

    // check again in 100ms
    setTimeout(function(){ adjustFramesize(iframe); }, 100);
  }
}

/**
 * Overwrite command execution of WYMeditor to use
 * the page preview extension if installed
 *
 * @param cmd - the command to execute
 */
WYMeditor.editor.prototype.exec = function(cmd) {

  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case WYMeditor.CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYMeditor.DIALOG_LINK);
    break;

    case WYMeditor.INSERT_IMAGE:
      this.dialog(WYMeditor.DIALOG_IMAGE);
    break;

    case WYMeditor.INSERT_TABLE:
      this.dialog(WYMeditor.DIALOG_TABLE);
    break;

    case WYMeditor.PASTE:
      this.dialog(WYMeditor.DIALOG_PASTE);
    break;

    case WYMeditor.TOGGLE_HTML:
      this.update();
      this.toggleHtml();

      //partially fixes #121 when the user manually inserts an image
      if(!jQuery(this._box).find(this._options.htmlSelector).is(':visible'))
        this.listen();
    break;

    case WYMeditor.PREVIEW:
      if (jQuery('input[name="preview_page"]')) {
        // page_preview is installed, use it
        jQuery('input[name="preview_page"]').click();
      } else {
        // use built-in preview dialog
        this.dialog(WYMeditor.PREVIEW);
      }
    break;

    default:
      this._exec(cmd);
    break;
  }
};