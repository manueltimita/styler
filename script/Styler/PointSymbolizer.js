Ext.namespace("Styler");
Styler.PointSymbolizer = Ext.extend(Ext.Panel, {
    symbolizer: null,
    pointGraphics: [{
        display: "circle",
        value: "circle",
        mark: true
    }, {
        display: "square",
        value: "square",
        mark: true
    }, {
        display: "triangle",
        value: "triangle",
        mark: true
    }, {
        display: "star",
        value: "star",
        mark: true
    }, {
        display: "cross",
        value: "cross",
        mark: true
    }, {
        display: "x",
        value: "x",
        mark: true
    }, {
        display: "external"
    }],
    defaultSymbolizer: {
        "graphicName": "circle",
        "rotation": 0,
        "pointRadius": 3,
        "fillColor": "#ffffff",
        "fillOpacity": 1,
        "strokeDashstyle": "solid",
        "strokeOpacity": 1
    },
    external: null,
    layout: "form",
    initComponent: function () {
        if (!this.symbolizer) {
            this.symbolizer = {};
        }
        Ext.applyIf(this.symbolizer, this.defaultSymbolizer);
        this.external = !! this.symbolizer["externalGraphic"];
        this.markPanel = new Ext.Panel({
            border: false,
            collapsed: this.external,
            layout: "form",
            items: [{
                xtype: "gx_fillsymbolizer",
                symbolizer: this.symbolizer,
                labelWidth: this.labelWidth,
                labelAlign: this.labelAlign,
                listeners: {
                    change: function (symbolizer) {
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                }
            }, {
                xtype: "gx_strokesymbolizer",
                symbolizer: this.symbolizer,
                labelWidth: this.labelWidth,
                labelAlign: this.labelAlign,
                listeners: {
                    change: function (symbolizer) {
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                }
            }]
        });
        this.urlField = new Ext.form.TextField({
            name: "url",
            fieldLabel: "URL",
            value: this.symbolizer["externalGraphic"],
            hidden: true,
            listeners: {
                change: function (field, value) {
                    this.symbolizer["externalGraphic"] = value;
                    this.fireEvent("change", this.symbolizer);
                },
                scope: this
            },
            width: 100
        });
        this.graphicPanel = new Ext.Panel({
            border: false,
            collapsed: !this.external,
            layout: "form",
            items: [this.urlField, {
                xtype: "slider",
                name: "opacity",
                fieldLabel: "Opacity",
                width: 100,
                value: (this.symbolizer["graphicOpacity"] == null) ? 100 : this.symbolizer["graphicOpacity"] * 100,
                isFormField: true,
                listeners: {
                    changecomplete: function (slider, value) {
                        this.symbolizer["graphicOpacity"] = value / 100;
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                },
                plugins: [new Styler.SliderTip({
                    getText: function (slider) {
                        return slider.getValue() + "%";
                    }
                })],
                width: 100
            }]
        });
        this.items = [{
            xtype: "combo",
            name: "mark",
            fieldLabel: "Symbol",
            store: new Ext.data.JsonStore({
                data: {
                    root: this.pointGraphics
                },
                root: "root",
                fields: ["value", "display", "preview", {
                    name: "mark",
                    type: "boolean"
                }]
            }),
            value: this.external ? 0 : this.symbolizer["graphicName"],
            displayField: "display",
            valueField: "value",
            tpl: new Ext.XTemplate('<tpl for=".">' + '<div class="x-combo-list-item gx-pointsymbolizer-mark-item">' + '<tpl if="preview">' + '<img src="{preview}" alt="{display}"/>' + '</tpl>' + '<span>{display}</span>' + '</div></tpl>'),
            mode: "local",
            allowBlank: false,
            triggerAction: "all",
            editable: false,
            listeners: {
                select: function (combo, record) {
                    var mark = record.get("mark");
                    var value = record.get("value");
                    if (!mark) {
                        if (value) {
                            this.urlField.hide();
                            this.urlField.getEl().up('.x-form-item').setDisplayed(false);
                            this.symbolizer["externalGraphic"] = value;
                        } else {
                            this.urlField.show();
                            this.urlField.getEl().up('.x-form-item').setDisplayed(true);
                        }
                        if (!this.external) {
                            this.external = true;
                            this.updateGraphicDisplay();
                        }
                    } else {
                        if (this.external) {
                            this.external = false;
                            delete this.symbolizer["externalGraphic"];
                            this.updateGraphicDisplay();
                        }
                        this.symbolizer["graphicName"] = value;
                    }
                    this.fireEvent("change", this.symbolizer);
                },
                scope: this
            },
            width: 100
        }, {
            xtype: "textfield",
            name: "size",
            fieldLabel: "Size",
            value: this.symbolizer["pointRadius"],
            listeners: {
                change: function (field, value) {
                    this.symbolizer["pointRadius"] = value;
                    this.fireEvent("change", this.symbolizer);
                },
                scope: this
            },
            width: 100
        }, {
            xtype: "textfield",
            name: "rotation",
            fieldLabel: "Rotation",
            value: this.symbolizer["rotation"],
            listeners: {
                change: function (field, value) {
                    this.symbolizer["rotation"] = value;
                    this.fireEvent("change", this.symbolizer);
                },
                scope: this
            },
            width: 100
        },
        this.markPanel, this.graphicPanel];
        this.addEvents("change");
        Styler.PointSymbolizer.superclass.initComponent.call(this);
    },
    updateGraphicDisplay: function () {
        if (this.external) {
            this.markPanel.collapse();
            this.graphicPanel.expand();
        } else {
            this.graphicPanel.collapse();
            this.markPanel.expand();
        }
    }
});

Ext.reg('gx_pointsymbolizer', Styler.PointSymbolizer);
