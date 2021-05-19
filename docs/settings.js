var DEFAULT_STATE_STRING_LIST =
[
    '通常@Aa_C00_M00_E00l_E00r_B00al_B00ar',
    '喜び@Aa_C00_M05_E30l_E30r_B00al_B00ar',
    '白目@Aa_C00_M10_E40l_E40r_B04al_B04ar',
    'ウィンク@Aa_S02_C00_M00_E30l_E00r_B00bl_B00ar',
];
var SCALE_LIST = {
    default_index: 7,
    list: [
        {caption: '9(最大)', ratio: 2.0},
        {caption: '8', ratio: 1.7},
        {caption: '7', ratio: 1.4},
        {caption: '6', ratio: 1.2},
        {caption: '5(原寸)', ratio: 1.0},
        {caption: '4', ratio: 0.8},
        {caption: '3', ratio: 0.6},
        {caption: '2', ratio: 0.4},
        {caption: '1(最小)', ratio: 0.2},
    ],
};
//326,288,767,599
var SETTINGS =
[
    {
        id:"Aa",
        caption:"夏目めいノーマル",
        width:1300,
        height:3200,
        suffix:"png",
        download:{
            face:{
                left:326, top:288, 
                width:767, height:599,
            },
        },
        layers:[
            {
                id:"S",
                caption:"記号",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, {id:"04"}, {id:"05"}, {id:"06"},
                ],
            },
            {
                id:"C",
                caption:"頬",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"},
                ],
            },
            {
                id:"M",
                caption:"口",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, {id:"04"}, {id:"05"}, 'br',
                    {id:"10"}, {id:"11"}, {id:"12"}, {id:"13"},
                ],
            },
            {
                id:"E",
                caption:"目",
                type:"left-right",
                //type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, 'br',
                    {id:"10"}, {id:"11"}, {id:"12"}, {id:"13"}, 'br',
                    {id:"20"}, {id:"21"}, 'br',
                    {id:"30"}, {id:"31"}, {id:"32"}, 'br',
                    {id:"40"}, {id:"41"}, {id:"42"}, {id:"43"}, {id:"44"}, 
                ],
            },
            {
                id:"B",
                caption:"眉",
                type:"left-right",
                //type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00a",
                images:[
                    {id:"00a"}, {id:"00b"}, 'br',
                    {id:"01a"}, {id:"01b"}, 'br',
                    {id:"02a"}, {id:"02b"}, 'br',
                    {id:"03a"}, {id:"03b"}, 'br',
                    {id:"04a"}, {id:"04b"}, 'br',
                    {id:"05a"}, {id:"05b"}, 'br',
                    {id:"06a"}, {id:"06b"}, 'br',
                    {id:"07a"}, {id:"07b"}, 'br',
                ],
            },
        ],
    },
    {
        id:"Ab",
        caption:"夏目めいパーカー無し",
        width:1300,
        height:3200,
        suffix:"png",
        download:{
            face:{
                left:326, top:288, 
                width:767, height:599,
            },
        },
        layers:[
            {
                id:"S",
                caption:"記号",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, {id:"04"}, {id:"05"}, {id:"06"},
                ],
            },
            {
                id:"C",
                caption:"頬",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"01",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"},
                ],
            },
            {
                id:"M",
                caption:"口",
                type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, {id:"04"}, {id:"05"}, 'br',
                    {id:"10"}, {id:"11"}, {id:"12"}, {id:"13"},
                ],
            },
            {
                id:"E",
                caption:"目",
                type:"left-right",
                //type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00",
                images:[
                    {id:"00"}, {id:"01"}, {id:"02"}, {id:"03"}, 'br',
                    {id:"10"}, {id:"11"}, {id:"12"}, {id:"13"}, 'br',
                    {id:"20"}, {id:"21"}, 'br',
                    {id:"30"}, {id:"31"}, {id:"32"}, 'br',
                    {id:"40"}, {id:"41"}, {id:"42"}, {id:"43"}, {id:"44"}, 
                ],
            },
            {
                id:"B",
                caption:"眉",
                type:"left-right",
                //type:"single",
                suffix:"png",
                left:326, top:288, 
                default:"00a",
                images:[
                    {id:"00a"}, {id:"00b"}, 'br',
                    {id:"01a"}, {id:"01b"}, 'br',
                    {id:"02a"}, {id:"02b"}, 'br',
                    {id:"03a"}, {id:"03b"}, 'br',
                    {id:"04a"}, {id:"04b"}, 'br',
                    {id:"05a"}, {id:"05b"}, 'br',
                    {id:"06a"}, {id:"06b"}, 'br',
                    {id:"07a"}, {id:"07b"}, 'br',
                ],
            },
        ],
    },
];
