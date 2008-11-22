/**
 * Provides standard module support for Widgets through an extension.
 * 
 * @module widget-stdmod
 */
    var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,
        Widget = Y.Widget,

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",
        FILL_HEIGHT = "fillHeight",
        STDMOD = "stdmod",

        PX = "px",
        NODE_SUFFIX = "Node",
        CONTENT_SUFFIX = "Content",
        INNER_HTML = "innerHTML",
        FIRST_CHILD = "firstChild",
        CHILD_NODES = "childNodes",

        CONTENT_BOX = "contentBox",
        BOUNDING_BOX = "boundingBox",

        HEIGHT = "height",
        OFFSET_HEIGHT = "offsetHeight",
        AUTO = "auto",

        HeaderChange = "headerContentChange",
        BodyChange = "bodyContentChange",
        FooterChange = "footerContentChange",
        FillHeightChange = "fillHeightChange",
        HeightChange = "HeightChange",        
        ContentUpdate = "contentUpdate",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI";

    /**
     * Widget extension, which can be used to add Standard Module support to the 
     * base Widget class, through the <a href="Base.html#method_build">Base.build</a> 
     * method.
     * <p>
     * The extension adds header, body and footer sections to the Widget's content box and 
     * provides the corresponding methods and attributes to modify the contents of these sections.
     * </p>
     * @class WidgetStdMod
     * @param {Object} The user configuration object
     */
    function StdMod(config) {

        this._stdModNode = this.get(CONTENT_BOX);

        Y.after(this._renderUIStdMod, this, RENDERUI);
        Y.after(this._bindUIStdMod, this, BINDUI);
        Y.after(this._syncUIStdMod, this, SYNCUI);
    }

    /**
     * Constant used to refer the the standard module header, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.HEADER
     * @static
     * @type String
     */
    StdMod.HEADER = HEADER;
    /**
     * Constant used to refer the the standard module body, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.BODY
     * @static
     * @type String
     */
    StdMod.BODY = BODY;
    /**
     * Constant used to refer the the standard module footer, in methods which expect a section specifier
     * 
     * @property WidgetStdMod.FOOTER
     * @static
     * @type String
     */
    StdMod.FOOTER = FOOTER;

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in 
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property WidgetStdMod.AFTER
     * @static
     * @type String
     */
    StdMod.AFTER = "after";

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property WidgetStdMod.BEFORE
     * @static
     * @type String
     */
    StdMod.BEFORE = "before";
    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * <em>Replaces</em> the sections existing content, with new content.
     * </p>
     * @property WidgetStdMod.REPLACE
     * @static
     * @type String
     */
    StdMod.REPLACE = "replace";

    var STD_HEADER = StdMod.HEADER,
        STD_BODY = StdMod.BODY,
        STD_FOOTER = StdMod.FOOTER,
        AFTER = StdMod.AFTER,
        BEFORE = StdMod.BEFORE;

    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetStdMod.
     * 
     * @property WidgetStdMod.ATTRS
     * @type Object
     * @static
     */
    StdMod.ATTRS = {

        /**
         * @attribute headerContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the header section. This will replace any existing content
         * in the header. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        headerContent: {
            get: function(val) {
                var live = this._getStdModContent(STD_HEADER);
                return (live === null) ? val : live;
            }
        },
        
        /**
         * @attribute footerContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the footer section. This will replace any existing content
         * in the footer. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        footerContent: {
            get: function(val) {
                var live = this._getStdModContent(STD_FOOTER);
                return (live === null) ? val : live;
            }
        },
        
        /**
         * @attribute bodyContent
         * @type {String | Node}
         * @default undefined
         * @description The content to be added to the body section. This will replace any existing content
         * in the body. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        bodyContent: {
            get: function(val) {
                var live = this._getStdModContent(STD_BODY);
                return (live === null) ? val : live;
            }
        },
        
        /**
         * @attribute fillHeight
         * @type {String}
         * @default WidgetStdMod.BODY
         * @description The section (WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER) which should be resized to fill the height of the standard module, when a 
         * height is set on the Widget. If a height is not set on the widget, then all sections are sized based on 
         * their content.
         */
        fillHeight: {
            value: StdMod.BODY,
            validator: function(val) {
                 return this._validateFillHeight(val);
            }
        }
    };

    /**
     * The HTML parsing rules for the WidgetStdMod class.
     * 
     * @property WidgetStdMod.HTML_PARSER
     * @static
     * @type Object
     */
    StdMod.HTML_PARSER = {
        headerContent: function(contentBox) {
            return this._parseStdModHTML(STD_HEADER);
        },

        bodyContent: function(contentBox) {
            return this._parseStdModHTML(STD_BODY);
        },

        footerContent : function(contentBox) {
            return this._parseStdModHTML(STD_FOOTER);
        }
    };

    /**
     * Static hash of default class names used for the header,
     * body and footer sections of the standard module, keyed by
     * the section identifier (WidgetStdMod.STD_HEADER, WidgetStdMod.STD_BODY, WidgetStdMod.STD_FOOTER)
     *
     * @property WidgetStdMod.SECTION_CLASS_NAMES
     * @static
     * @type Object
     */
    StdMod.SECTION_CLASS_NAMES = {
        header: Widget.getClassName(HD),
        body: Widget.getClassName(BD),
        footer: Widget.getClassName(FT)
    };

    /**
     * The template HTML strings for each of the standard module sections. Section entries are keyed by the section constants,
     * WidgetStdMod.HEADER, WidgetStdMod.BODY, WidgetStdMod.FOOTER, and contain the HTML to be added for each section.
     * e.g.
     * <pre>
     *    {
     *       header : '<div class="yui-widget-hd"></div>,
     *       body : '<div class="yui-widget-bd"></div>,
     *       footer : '<div class="yui-widget-ft"></div>
     *    }
     * </pre>
     * @property TEMPLATES
     * @type Object
     * @static
     */
    StdMod.TEMPLATES = {
        header : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_HEADER] + '"></div>',
        body : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_BODY] + '"></div>',
        footer : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_FOOTER] + '"></div>'
    };

    /**
     * Stores nodes created from the WidgetStdMod.TEMPLATES strings,
     * which are cloned to create new header, footer, body sections for
     * new instances.
     *
     * @property WidgetStdMod._TEMPLATES
     * @static
     * @private
     */
    StdMod._TEMPLATES = {};

    StdMod.prototype = {

        /**
         * Synchronizes the UI to match the Widgets standard module state.
         * <p>
         * This method is invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIStdMod
         * @protected
         */
        _syncUIStdMod : function() {
            this._uiSetStdMod(STD_HEADER, this.get(STD_HEADER + CONTENT_SUFFIX));
            this._uiSetStdMod(STD_BODY, this.get(STD_BODY + CONTENT_SUFFIX));
            this._uiSetStdMod(STD_FOOTER, this.get(STD_FOOTER + CONTENT_SUFFIX));
            this._uiSetFillHeight(this.get(FILL_HEIGHT));
        },

        /**
         * Creates/Initializes the DOM for standard module support.
         * <p>
         * This method is invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStdMod
         * @protected
         */
        _renderUIStdMod : function() {
            this._stdModNode.addClass(Widget.getClassName(STDMOD));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget standard module related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStdMod
         * @protected
         */
        _bindUIStdMod : function() {
            this.after(HeaderChange, this._afterHeaderChange);
            this.after(BodyChange, this._afterBodyChange);
            this.after(FooterChange, this._afterFooterChange);

            this.after(FillHeightChange, this._afterFillHeightChange);
            this.after(HeightChange, this._fillHeight);            
            this.after(ContentUpdate, this._fillHeight);
        },

        /**
         * Default attribute change listener for the headerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterHeaderChange
         * @protected
         * @param {Event.Facade} e The event facade for the attribute change
         */
        _afterHeaderChange : function(e) {
            this._uiSetStdMod(STD_HEADER, e.newVal, e.stdModPosition);
        },

        /**
         * Default attribute change listener for the bodyContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterBodyChange
         * @protected
         * @param {Event.Facade} e The event facade for the attribute change
         */
        _afterBodyChange : function(e) {
            this._uiSetStdMod(STD_BODY, e.newVal, e.stdModPosition);
        },

        /**
         * Default attribute change listener for the footerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterFooterChange
         * @protected
         * @param {Event.Facade} e The event facade for the attribute change
         */
        _afterFooterChange : function(e) {
            this._uiSetStdMod(STD_FOOTER, e.newVal, e.stdModPosition);
        },

        /**
         * Default attribute change listener for the fillHeight attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _afterFillHeightChange
         * @protected
         * @param {Event.Facade} e The event facade for the attribute change
         */
        _afterFillHeightChange: function (e) {
            this._uiSetFillHeight(e.newVal);
        },

        /**
         * Default validator for the fillHeight attribute. Verifies that the 
         * value set is a valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER,
         * or a falsey value if fillHeight is to be disabled.
         *
         * @method _validateFillHeight
         * @protected
         * @param {String} val The section which should be setup to fill height, or false/null to disable fillHeight
         * @return true if valid, false if not
         */
        _validateFillHeight : function(val) {
            return !val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER;    
        },

        /**
         * Updates the rendered UI, to resize the provided section so that the standard module fills out 
         * the specified widget height. Note: This method does not check whether or not a height is set 
         * on the Widget.
         * 
         * @method _uiSetFillHeight
         * @protected
         * @param {String} fillSection A valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER
         */
        _uiSetFillHeight : function(fillSection) {
            var fillNode = this.getStdModNode(fillSection);
            var currNode = this._currFillNode;

            if (currNode && fillNode !== currNode){
                currNode.setStyle(HEIGHT, EMPTY);
            }

            if (fillNode) {
                this._currFillNode = fillNode;
            }

            this._fillHeight();
        },

        /**
         * Updates the rendered UI, to resize the current section specified by the fillHeight attribute, so
         * that the standard module fills out the Widget height. If a height has not been set on Widget,
         * the section is not resized (height is set to "auto").
         * 
         * @method _fillHeight
         * @private
         */
        _fillHeight : function() {
            if (this.get(FILL_HEIGHT)) {
                var height = this.get(HEIGHT);
                if (height != EMPTY && height != AUTO) {
                    this.fillHeight(this._currFillNode);    
                }
            }
        },

        /**
         * Updates the rendered UI, adding the provided content (either an HTML string, or node reference),
         * to the specified section. The content is either added before, after or replaces existing content
         * in the section, based on the value of the <code>where</code> argument.
         * 
         * @method _uiSetStdMod
         * @protected
         * 
         * @param {String} section The section to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER. 
         * @param {String | Node} content The new content (either as an HTML string, or Node reference) to add to the section
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        _uiSetStdMod : function(section, content, where) {
            if (content) {
                var node = this.getStdModNode(section) || this._renderStdMod(section);
                if (content instanceof Node) {
                    this._addNodeRef(node, content, where);
                } else {
                    this._addNodeHTML(node, content, where);
                }
                this.fire(ContentUpdate);
            }
        },

        /**
         * Creates the DOM node for the given section, and inserts it into the correct location in the contentBox.
         *
         * @method _renderStdMod
         * @protected
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} A reference to the added section node
         */
        _renderStdMod : function(section) {

            var contentBox = this.get(CONTENT_BOX),
                sectionNode = this._findStdModSection(section);

            if (!sectionNode) {
                sectionNode = this._getStdModTemplate(section);
            }

            this._insertStdModSection(contentBox, section, sectionNode);

            this[section + NODE_SUFFIX] = sectionNode;
            return this[section + NODE_SUFFIX];
        },

        /**
         * Helper method to insert the Node for the given section into the correct location in the contentBox.
         *
         * @method _insertStdModSection
         * @private
         * @param {Node} contentBox A reference to the Widgets content box.
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {Node} sectionNode The Node for the section.
         */
        _insertStdModSection : function(contentBox, section, sectionNode) {
            var fc = contentBox.get(FIRST_CHILD);

            if (section === STD_FOOTER || !fc) {
                contentBox.appendChild(sectionNode);
            } else {
                if (section === STD_HEADER) {
                    contentBox.insertBefore(sectionNode, fc);
                } else {
                    // BODY
                    var footer = this[STD_FOOTER + NODE_SUFFIX];
                    if (footer) {
                        contentBox.insertBefore(sectionNode, footer);
                    } else {
                        contentBox.appendChild(sectionNode);
                    }
                }
            }
        },

        /**
         * Gets a new Node reference for the given standard module section, by cloning
         * the stored template node.
         *
         * @method _getStdModTemplate
         * @protected
         * @param {String} section The section to create a new node for. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The new Node instance for the section
         */
        _getStdModTemplate : function(section) {
            var template = StdMod._TEMPLATES[section];

            if (!template) {
                StdMod._TEMPLATES[section] = template = Node.create(StdMod.TEMPLATES[section]);
            }
            return template.cloneNode(true);
        },

        /**
         * Helper method to add the given HTML string to the node reference provided.
         * The HTML is added either before, after or replaces the existing node content 
         * based on the value of the <code>where</code> argument.
         *
         * @method _addNodeHTML
         * @private
         * 
         * @param {Node} node The section Node to be updated.
         * @param {String} html The new content HTML string to be added to the section Node.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace Nodes existing content.
         */
        _addNodeHTML : function(node, html, where) {
            if (where == AFTER) {
                node.set(INNER_HTML, node.get(INNER_HTML) + html);
            } else if (where == BEFORE) {
                node.set(INNER_HTML, html + node.get(INNER_HTML));
            } else {
                node.set(INNER_HTML, html);
            }
        },

        /**
         * Helper method to add nodes, to another node.
         * The child node(s) are added either before, after or replaces the existing node content 
         * based on the value of the <code>where</code> argument.
         * 
         * @method _addNodeRef
         * @private
         * 
         * @param {Node} node The section Node to be updated.
         * @param {Node} child The new content Node to be added to section Node provided.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the Node.
         */
        _addNodeRef : function(node, children, where) {
            var append = true, 
                i, s;

            if (where == BEFORE) {
                if (node.get(FIRST_CHILD)) {
                    for (i = node.size() - 1; i >=0; --i) {
                        node.insertBefore(children.item(i), node.get(FIRST_CHILD));
                    }
                    append = false;
                }
            } else if (where != AFTER) { // replace
                node.set(INNER_HTML, EMPTY);
            }
            if (append) {
                for (i = 0, s = children.size(); i < s; ++i) {
                    node.appendChild(children.item(i));
                }
            }
        },

        /**
         * Helper method to obtain the precise height of the node provided, including padding and border.
         * The height could be a sub-pixel value for certain browsers, such as Firefox 3.
         *
         * @method _getPreciseHeight
         * @private
         * @param {Node} node The node for which the precise height is required.
         * @return {Number} The height of the Node including borders and padding, possibly a float.
         */
        _getPreciseHeight : function(node) {
            var height = (node) ? node.get(OFFSET_HEIGHT) : 0,
                getBCR = "getBoundingClientRect";

            if (node && node.hasMethod(getBCR)) {
                var preciseRegion = node.invoke(getBCR);
                if (preciseRegion) {
                    height = preciseRegion.bottom - preciseRegion.top;
                }
            }

            return height;
        },

        /**
         * Helper method to query the rendered contents of the contentBox to find the
         * node for the given section if it exists.
         * 
         * @method _findStdModSection
         * @private
         * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The rendered node for the given section, or null if not found.
         */
        _findStdModSection: function(section) {
            return this.get(CONTENT_BOX).query("> ." + StdMod.SECTION_CLASS_NAMES[section]);
        },

        /**
         * Utility method, used by WidgetStdMods HTML_PARSER implementation
         * to extract data for each section from markup.
         *
         * @method _parseStdModHTML
         * @private
         * @param {String} section
         * @return {String} Inner HTML string with the contents of the section
         */
        _parseStdModHTML : function(section) {
            var node = this._findStdModSection(section);
            return (node) ? node.get(INNER_HTML) : "";
        },

        /**
         * Retrieves the child nodes (content) of a standard module section
         * 
         * @method _getStdModContent
         * @private
         * @param {String} section The standard module section whose child nodes are to be retrieved. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The child node collection of the standard module section.
         */
        _getStdModContent : function(section) {
            return (this[section + NODE_SUFFIX]) ? this[section + NODE_SUFFIX].get(CHILD_NODES) : null;
        },

        /**
         * Updates the body section of the standard module with the content provided (either an HTML string, or node reference).
         * <p>
         * This method can be used instead of the corresponding section content attribute if you'd like to retain the current content of the section,
         * and insert content before or after it, by specifying the <code>where</code> argument.
         * </p>
         * @method setStdModContent
         * @param {String} section The standard module section whose content is to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {String | Node} content The content to be added, either an HTML string or a Node reference.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        setStdModContent : function(section, content, where) {
            this.set(section + CONTENT_SUFFIX, content, {stdModPosition:where});
        },

        /**
         * Returns the node reference for the given section. Note: The DOM is not queried for the node reference. The reference
         * stored by the widget instance is returned if set.
         * 
         * @method getStdModNode
         * @param {String} section The section whose node reference is required. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The node reference for the section, or null if not set.
         */
        getStdModNode : function(section) {
            return this[section + NODE_SUFFIX] || null;
        },

        /**
         * Sets the height on the provided header, body or footer element to 
         * fill out the height of the Widget. It determines the height of the 
         * widgets bounding box, based on it's configured height value, and 
         * sets the height of the provided section to fill out any 
         * space remaining after the other standard module section heights 
         * have been accounted for.
         * 
         * <p><strong>NOTE:</strong> This method is not designed to work if an explicit 
         * height has not been set on the Widget, since for an "auto" height Widget, 
         * the heights of the header/body/footer will drive the height of the Widget.</p>
         *
         * @method fillHeight
         * @param {Node} node The node which should be resized to fill out the height
         * of the Widget bounding box. Should be a standard module section node which belongs
         * to the widget.
         */
        fillHeight : function(node) {
            if (node) {
                var boundingBox = this.get(BOUNDING_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    total = 0,
                    filled = 0,
                    remaining = 0,
                    validNode = false;

                for (var i = 0, l = stdModNodes.length; i < l; i++) {
                    stdModNode = stdModNodes[i];
                    if (stdModNode) {
                        if (stdModNode !== node) {
                            filled += this._getPreciseHeight(stdModNode);
                        } else {
                            validNode = true;
                        }
                    }
                }

                if (validNode) {
                    if (UA.ie || UA.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        node.setStyle(HEIGHT, 0 + PX);
                    }

                    total = parseInt(boundingBox.getComputedStyle(HEIGHT), 10);
                    if (L.isNumber(total)) {
                        remaining = total - filled;

                        if (remaining >= 0) {
                            node.setStyle(HEIGHT, remaining + PX);
                        }

                        // Re-adjust height if required, to account for el padding and border
                        var offsetHeight = this.get(CONTENT_BOX).get(OFFSET_HEIGHT); 
                        if (offsetHeight != total) {
                            remaining = remaining - (offsetHeight - total);
                            node.setStyle(HEIGHT, remaining + PX);
                        }
                    }
                }
            }
        }
    };

    Y.WidgetStdMod = StdMod;