object MainForm: TMainForm
  Left = 0
  Top = 0
  Caption = #25968#25454#27169#22411#29983#25104#22120
  ClientHeight = 494
  ClientWidth = 933
  Color = clBtnFace
  Font.Charset = ANSI_CHARSET
  Font.Color = clWindowText
  Font.Height = -13
  Font.Name = 'Verdana'
  Font.Style = []
  OldCreateOrder = False
  PixelsPerInch = 96
  TextHeight = 16
  object AdvSplitter1: TAdvSplitter
    Left = 215
    Top = 0
    Height = 494
    ResizeStyle = rsUpdate
    Appearance.BorderColor = clNone
    Appearance.BorderColorHot = clNone
    Appearance.Color = clWhite
    Appearance.ColorTo = clSilver
    Appearance.ColorHot = clWhite
    Appearance.ColorHotTo = clGray
    GripStyle = sgDots
    ExplicitLeft = 208
    ExplicitTop = 213
    ExplicitHeight = 100
  end
  object Panel1: TPanel
    Left = 0
    Top = 0
    Width = 215
    Height = 494
    Align = alLeft
    BevelOuter = bvNone
    TabOrder = 0
    object HTMLCheckList1: THTMLCheckList
      Left = 0
      Top = 31
      Width = 215
      Height = 401
      Align = alClient
      CommentFont.Charset = DEFAULT_CHARSET
      CommentFont.Color = clWindowText
      CommentFont.Height = -11
      CommentFont.Name = 'Tahoma'
      CommentFont.Style = []
      ItemHeight = 20
      TabOrder = 0
      OnClick = HTMLCheckList1Click
      Version = '2.3.2.0'
    end
    object Button1: TButton
      Left = 0
      Top = 0
      Width = 215
      Height = 31
      Align = alTop
      Caption = #36830#25509#25968#25454#24211
      TabOrder = 1
      OnClick = Button1Click
    end
    object Button2: TButton
      Left = 0
      Top = 432
      Width = 215
      Height = 31
      Align = alBottom
      Caption = #23548#20986#32531#23384#27169#22411
      TabOrder = 2
      OnClick = Button2Click
    end
    object Button3: TButton
      Left = 0
      Top = 463
      Width = 215
      Height = 31
      Align = alBottom
      Caption = #23548#20986'SQL'#27169#22411
      TabOrder = 3
      OnClick = Button3Click
    end
  end
  object PageControl1: TPageControl
    Left = 218
    Top = 0
    Width = 715
    Height = 494
    ActivePage = TabSheet2
    Align = alClient
    TabOrder = 1
    object TabSheet1: TTabSheet
      Caption = #34920#32467#26500
      object DBGridEh1: TDBGridEh
        Left = 0
        Top = 0
        Width = 707
        Height = 463
        Align = alClient
        DataSource = UniDataSource1
        DrawMemoText = True
        DynProps = <>
        IndicatorOptions = [gioShowRowIndicatorEh]
        SumList.VirtualRecords = True
        TabOrder = 0
        Columns = <
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'TABLE_NAME'
            Footers = <>
            Title.Caption = #34920#21517
            Title.TitleButton = True
            Width = 150
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'COLUMN_NAME'
            Footers = <>
            Title.Caption = #23383#27573#21517
            Title.TitleButton = True
            Width = 100
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'POSITION'
            Footers = <>
            Title.Caption = #20301#32622
            Title.TitleButton = True
            Width = 50
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'DATA_TYPE'
            Footers = <>
            Title.Caption = #31867#22411
            Title.TitleButton = True
            Width = 80
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'DATA_LENGTH'
            Footers = <>
            Title.Caption = #38271#24230
            Title.TitleButton = True
            Width = 50
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'DATA_PRECISION'
            Footers = <>
            Title.Caption = #25972#25968
            Title.TitleButton = True
            Width = 60
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'DATA_SCALE'
            Footers = <>
            Title.Caption = #23567#25968#20301
            Title.TitleButton = True
            Width = 50
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'NULLABLE'
            Footers = <>
            Title.Caption = #21487#31354
            Title.TitleButton = True
            Width = 50
          end
          item
            DynProps = <>
            EditButtons = <>
            FieldName = 'DEFAULT_VALUE'
            Footers = <>
            Title.Caption = #40664#35748#20540
            Title.TitleButton = True
            Width = 80
          end>
        object RowDetailData: TRowDetailPanelControlEh
        end
      end
    end
    object TabSheet2: TTabSheet
      Caption = #22806#38190#23450#20041
      ImageIndex = 1
      object ListView1: TListView
        Left = 0
        Top = 0
        Width = 707
        Height = 463
        Align = alClient
        Columns = <
          item
            Caption = #22806#24314#23383#27573
            Width = 80
          end
          item
            Caption = #23545#24212#34920
            Width = 150
          end
          item
            Caption = #22806#38190#23545#24212#23383#27573
            Width = 100
          end
          item
            Caption = #32852#26597#23383#27573
            Width = 200
          end
          item
            Caption = #21069#32512
            Width = 80
          end>
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -13
        Font.Name = #24494#36719#38597#40657
        Font.Style = []
        Items.ItemData = {
          01D00200000700000000000000FFFFFFFFFFFFFFFF0400000000000000076400
          6500700074005F00690064000D620064005F006400650070006100720074006D
          0065006E00740002690064000963006F00640065002C006E0061006D00650004
          640065007000740000000000FFFFFFFFFFFFFFFF0400000000000000066F0072
          0067005F00690064000B620064005F006F007200670061006E0069007A006500
          02690064000963006F00640065002C006E0061006D006500036F007200670000
          000000FFFFFFFFFFFFFFFF04000000000000000970006100720065006E007400
          5F0069006400052300730065006C00660002690064000963006F00640065002C
          006E0061006D0065000670006100720065006E00740000000000FFFFFFFFFFFF
          FFFF04000000000000000770006F00730074005F006900640007620064005F00
          70006F007300740002690064000963006F00640065002C006E0061006D006500
          0470006F007300740000000000FFFFFFFFFFFFFFFF0400000000000000086300
          6C006100730073005F00690064000B2300730065006C0066005F0063006C0061
          007300730002690064000963006F00640065002C006E0061006D006500056300
          6C0061007300730000000000FFFFFFFFFFFFFFFF04000000000000000669006E
          0076005F00690064000969006E00760065006E0074006F007200790002690064
          001D63006F00640065002C006E0061006D0065002C006D006F00640065006C00
          2C006E006F0072006D0073002C0075006E00690074005F00690064000369006E
          00760000000000FFFFFFFFFFFFFFFF04000000000000000775006E0069007400
          5F006900640007620064005F0075006E006900740002690064000B6E0061006D
          0065002C00730079006D0062006F006C000475006E0069007400FFFFFFFFFFFF
          FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
          FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF}
        ParentFont = False
        TabOrder = 0
        ViewStyle = vsReport
        ExplicitLeft = -1
      end
    end
  end
  object UniConnection1: TUniConnection
    AutoCommit = False
    ProviderName = 'MySQL'
    Database = 'sales'
    Username = 'root'
    Server = '127.0.0.1'
    ConnectDialog = UniConnectDialog1
    Left = 266
    Top = 110
    EncryptedPassword = '8DFF90FF90FF8BFF'
  end
  object UniConnectDialog1: TUniConnectDialog
    DatabaseLabel = #25968#25454#24211
    PortLabel = #31471#21475
    ProviderLabel = #39537#21160
    SavePassword = True
    Caption = #36830#25509
    UsernameLabel = #29992#25143#21517
    PasswordLabel = #23494#30721
    ServerLabel = #26381#21153#22120
    ConnectButton = #36830#25509
    CancelButton = #21462#28040
    LabelSet = lsCustom
    Left = 165
    Top = 51
  end
  object MySQLUniProvider1: TMySQLUniProvider
    Left = 257
    Top = 192
  end
  object SQLServerUniProvider1: TSQLServerUniProvider
    Left = 406
    Top = 185
  end
  object PostgreSQLUniProvider1: TPostgreSQLUniProvider
    Left = 328
    Top = 258
  end
  object UniDataSource1: TUniDataSource
    DataSet = UniQuery1
    Left = 517
    Top = 226
  end
  object UniQuery1: TUniQuery
    Connection = UniConnection1
    UniDirectional = True
    Left = 422
    Top = 217
  end
end
