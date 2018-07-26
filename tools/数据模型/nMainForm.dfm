object MainForm: TMainForm
  Left = 0
  Top = 0
  Caption = #25968#25454#27169#22411#29983#25104#22120
  ClientHeight = 563
  ClientWidth = 933
  Color = clBtnFace
  Font.Charset = ANSI_CHARSET
  Font.Color = clWindowText
  Font.Height = -13
  Font.Name = 'Verdana'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 16
  object AdvSplitter1: TAdvSplitter
    Left = 215
    Top = 0
    Height = 563
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
    Height = 563
    Align = alLeft
    BevelOuter = bvNone
    TabOrder = 0
    object HTMLCheckList1: THTMLCheckList
      Left = 0
      Top = 31
      Width = 215
      Height = 470
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
      Top = 501
      Width = 215
      Height = 31
      Align = alBottom
      Caption = #23548#20986#32531#23384#27169#22411
      TabOrder = 2
      OnClick = Button2Click
    end
    object Button3: TButton
      Left = 0
      Top = 532
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
    Height = 563
    ActivePage = TabSheet4
    Align = alClient
    TabOrder = 1
    object TabSheet1: TTabSheet
      Caption = #34920#32467#26500
      object DBGridEh1: TDBGridEh
        Left = 0
        Top = 0
        Width = 707
        Height = 532
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
    object TabSheet4: TTabSheet
      Caption = 'SQL'#27169#22411#36873#39033
      ImageIndex = 3
      object PageControl2: TPageControl
        Left = 0
        Top = 0
        Width = 707
        Height = 532
        ActivePage = TabSheet5
        Align = alClient
        TabOrder = 0
        object TabSheet5: TTabSheet
          Caption = #22806#38190#23450#20041
          object ListView1: TListView
            Left = 0
            Top = 0
            Width = 699
            Height = 501
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
              end
              item
                Caption = #25351#23450
              end>
            Font.Charset = DEFAULT_CHARSET
            Font.Color = clWindowText
            Font.Height = -13
            Font.Name = #24494#36719#38597#40657
            Font.Style = []
            Items.ItemData = {
              01610900001800000000000000FFFFFFFFFFFFFFFF0400000000000000076400
              6500700074005F00690064000D620064005F006400650070006100720074006D
              0065006E00740002690064000963006F00640065002C006E0061006D00650004
              640065007000740000000000FFFFFFFFFFFFFFFF04000000000000000770006F
              00730074005F006900640007620064005F0070006F0073007400026900640009
              63006F00640065002C006E0061006D0065000470006F007300740000000000FF
              FFFFFFFFFFFFFF0500000000000000067000610072005F006900640005230073
              0065006C00660002690064000963006F00640065002C006E0061006D00650003
              700061007200045E00620064005F0000000000FFFFFFFFFFFFFFFF0400000000
              0000000770006F00730074005F006900640007620064005F0070006F00730074
              0002690064000963006F00640065002C006E0061006D0065000470006F007300
              740000000000FFFFFFFFFFFFFFFF04000000000000000863006C006100730073
              005F00690064000B2300730065006C0066005F0063006C006100730073000269
              0064000963006F00640065002C006E0061006D0065000563006C006100730073
              0000000000FFFFFFFFFFFFFFFF04000000000000000669006E0076005F006900
              64000C620064005F0069006E00760065006E0074006F00720079000269006400
              1663006F00640065002C006E0061006D0065002C0073007000650063002C0063
              0061006D002C006D0064006C000369006E00760000000000FFFFFFFFFFFFFFFF
              04000000000000000775006E00690074005F006900640007620064005F007500
              6E006900740002690064000B6E0061006D0065002C00730079006D0062006F00
              6C000475006E006900740000000000FFFFFFFFFFFFFFFF040000000000000005
              63006F005F00690064000A620064005F0063006F006D00700061006E00790002
              69006400046E0061006D0065000263006F0000000000FFFFFFFFFFFFFFFF0400
              00000000000005650065005F00690064000B620064005F0065006D0070006C00
              6F0079006500650002690064000963006F00640065002C006E0061006D006500
              026500650000000000FFFFFFFFFFFFFFFF040000000000000007630075007300
              74005F00690064000A620064005F0070006100720074006E0065007200026900
              64000963006F00640065002C006E0061006D0065000463007500730074000000
              0000FFFFFFFFFFFFFFFF040000000000000007760065006E0064005F00690064
              000A620064005F0070006100720074006E006500720002690064000963006F00
              640065002C006E0061006D00650004760065006E00640000000000FFFFFFFFFF
              FFFFFF04000000000000000675006F006D005F006900640007620064005F0075
              006E006900740002690064000963006F00640065002C006E0061006D00650003
              75006F006D0000000000FFFFFFFFFFFFFFFF040000000000000007700072006F
              0063005F00690064000A620064005F00700072006F0063006500730073000269
              0064000963006F00640065002C006E0061006D00650004700072006F00630000
              000000FFFFFFFFFFFFFFFF040000000000000005690070005F00690064001162
              0064005F0069006E00760065006E0074006F00720079005F00700072006F0063
              0002690064000F700072006900630065002C00720061006400690078002C0072
              0074006F00026900700000000000FFFFFFFFFFFFFFFF04000000000000000773
              0069007A0065005F006900640007620064005F00730069007A00650002690064
              000963006F00640065002C006E0061006D00650004730069007A006500000000
              00FFFFFFFFFFFFFFFF040000000000000008730069007A00650073005F006900
              640008620064005F00730069007A0065007300026900640005730069007A0065
              00730005730069007A006500730000000000FFFFFFFFFFFFFFFF040000000000
              000005770068005F00690064000C620064005F00770061007200650068006F00
              75007300650002690064000963006F00640065002C006E0061006D0065000277
              00680000000000FFFFFFFFFFFFFFFF040000000000000008610069006D007700
              68005F00690064000C620064005F00770061007200650068006F007500730065
              0002690064000963006F00640065002C006E0061006D00650005610069006D00
              7700680000000000FFFFFFFFFFFFFFFF0400000000000000086D006F006E0065
              0079005F006900640008620064005F006D006F006E0065007900026900640010
              63006F00640065002C006E0061006D0065002C00730079006D0062006F006C00
              056D006F006E006500790000000000FFFFFFFFFFFFFFFF040000000000000007
              61006300630074005F00690064000E620064005F006100630063006F0075006E
              0074005F006E006200720002690064000C61006300630074005F006E00620072
              002C0062006E006B0004610063006300740000000000FFFFFFFFFFFFFFFF0400
              00000000000006620061006C005F00690064000F620064005F00620061006C00
              61006E00630065005F006D006F006400650002690064000963006F0064006500
              2C006E0061006D00650003620061006C0000000000FFFFFFFFFFFFFFFF040000
              000000000007700072006F006A005F00690064000A700073005F00700072006F
              006A0065006300740002690064000963006F00640065002C006E0061006D0065
              0004700072006F006A0000000000FFFFFFFFFFFFFFFF04000000000000000765
              007800650073005F00690064000F620064005F006100630063006F0075006E00
              74005F00650078006500730002690064000963006F00640065002C006E006100
              6D00650004650078006500730000000000FFFFFFFFFFFFFFFF04000000000000
              00076900740065006D005F00690064000F67006C005F006100630063006F0075
              006E0074005F006900740065006D0002690064000963006F00640065002C006E
              0061006D006500046900740065006D00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
              FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF}
            ParentFont = False
            TabOrder = 0
            ViewStyle = vsReport
          end
        end
        object TabSheet6: TTabSheet
          Caption = #38468#21152#25628#32034#26465#20214
          ImageIndex = 1
          object ListView2: TListView
            Left = 0
            Top = 0
            Width = 699
            Height = 501
            Align = alClient
            Columns = <
              item
                Caption = #34920#21517
                Width = 150
              end
              item
                Caption = #33258#23450#20041#25628#32034#26465#20214
                MaxWidth = 500
                Width = 500
              end>
            Font.Charset = DEFAULT_CHARSET
            Font.Color = clWindowText
            Font.Height = -13
            Font.Name = #24494#36719#38597#40657
            Font.Style = []
            Items.ItemData = {
              01010400000500000000000000FFFFFFFFFFFFFFFF0100000000000000076200
              64005F0070006F00730074004C7B0069006600200070006100720065006E0074
              007D00200061006E006400200069006400200069006E0020002800730065006C
              006500630074002000690064002000660072006F006D00200066005F0070006F
              00730074005F006C006F00770028007B007B0070006100720065006E0074007D
              007D002900290020007B0065006E00640069006600200070006100720065006E
              0074007D0000000000FFFFFFFFFFFFFFFF01000000000000000D620064005F00
              6400650070006100720074006D0065006E0074004C7B00690066002000700061
              00720065006E0074007D00200061006E006400200069006400200069006E0020
              002800730065006C006500630074002000690064002000660072006F006D0020
              0066005F0064006500700074005F006C006F00770028007B007B007000610072
              0065006E0074007D007D002900290020007B0065006E00640069006600200070
              006100720065006E0074007D0000000000FFFFFFFFFFFFFFFF01000000000000
              000B620064005F0065006D0070006C006F00790065006500517B006900660020
              0070006100720065006E0074007D00200061006E006400200064006500700074
              005F0069006400200069006E0020002800730065006C00650063007400200069
              0064002000660072006F006D00200066005F0064006500700074005F006C006F
              00770028007B007B0070006100720065006E0074007D007D002900290020007B
              0065006E00640069006600200070006100720065006E0074007D0000000000FF
              FFFFFFFFFFFFFF01000000000000000C620064005F0069006E00760065006E00
              74006F0072007900517B0069006600200070006100720065006E0074007D0020
              0061006E006400200063006C006100730073005F0069006400200069006E0020
              002800730065006C006500630074002000690064002000660072006F006D0020
              0066005F0069006E0076005F006C006F00770028007B007B0070006100720065
              006E0074007D007D002900290020007B0065006E006400690066002000700061
              00720065006E0074007D0000000000FFFFFFFFFFFFFFFF010000000000000012
              620064005F0069006E00760065006E0074006F00720079005F0063006C006100
              730073004B7B0069006600200070006100720065006E0074007D00200061006E
              006400200069006400200069006E0020002800730065006C0065006300740020
              00690064002000660072006F006D00200066005F0069006E0076005F006C006F
              00770028007B007B0070006100720065006E0074007D007D002900290020007B
              0065006E00640069006600200070006100720065006E0074007D00FFFFFFFFFF
              FFFFFFFFFF}
            ParentFont = False
            TabOrder = 0
            ViewStyle = vsReport
            ExplicitHeight = 432
          end
        end
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
