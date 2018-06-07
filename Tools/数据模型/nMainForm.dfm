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
      ExplicitHeight = 432
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
      ExplicitTop = 463
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
      ExplicitLeft = 14
      ExplicitTop = 483
    end
  end
  object DBGridEh1: TDBGridEh
    Left = 218
    Top = 0
    Width = 715
    Height = 494
    Align = alClient
    DataSource = UniDataSource1
    DrawMemoText = True
    DynProps = <>
    IndicatorOptions = [gioShowRowIndicatorEh]
    TabOrder = 1
    Columns = <
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'TABLE_NAME'
        Footers = <>
        Title.Caption = #34920#21517
        Width = 100
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'COLUMN_NAME'
        Footers = <>
        Title.Caption = #23383#27573#21517
        Width = 100
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'POSITION'
        Footers = <>
        Title.Caption = #20301#32622
        Width = 50
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'DATA_TYPE'
        Footers = <>
        Title.Caption = #31867#22411
        Width = 60
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'DATA_LENGTH'
        Footers = <>
        Title.Caption = #38271#24230
        Width = 50
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'DATA_PRECISION'
        Footers = <>
        Title.Caption = #25972#25968
        Width = 60
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'DATA_SCALE'
        Footers = <>
        Title.Caption = #23567#25968#20301
        Width = 50
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'NULLABLE'
        Footers = <>
        Title.Caption = #21487#31354
        Width = 50
      end
      item
        DynProps = <>
        EditButtons = <>
        FieldName = 'DEFAULT_VALUE'
        Footers = <>
        Title.Caption = #40664#35748#20540
        Width = 80
      end>
    object RowDetailData: TRowDetailPanelControlEh
    end
  end
  object UniConnection1: TUniConnection
    AutoCommit = False
    ProviderName = 'MySQL'
    Database = 'sales'
    Username = 'root'
    Server = '127.0.0.1'
    ConnectDialog = UniConnectDialog1
    Left = 270
    Top = 112
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
    Left = 517
    Top = 226
  end
end
