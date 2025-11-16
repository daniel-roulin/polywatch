Steps to get a have the map with building and building names:

- Open this folder in VSCode
- Start a live server of this folder
- Start QGis

Three data source:
- https://prod-plan-epfl-tiles0.epfl.ch/1.0.0/WMTSCapabilities_new_prod_2056.xml
    Contains the building images in `batiments` and the base map. Can choose floor when adding layer.

- https://plan.epfl.ch/mapserv_proxy?ogcserver=MapServer&SERVICE=WMS&REQUEST=GetCapabilities
    Contains room names in `locaux_labels` and a lot of other icons spread out over the map.

- http://127.0.0.1:5500/batiments_routes_labels.xml
    Contain building names in `batiments_routes_labels`

- http://127.0.0.1:5500/locaux_labels.xml
    Contains room names in `locaux_labels` 
